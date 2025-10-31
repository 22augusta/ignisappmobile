import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useIncidents } from '../contexts/IncidentContext';

const INCIDENT_TYPES = [
  'Incêndio',
  'Acidente de Trânsito',
  'Resgate',
  'Emergência Médica',
  'Vazamento de Gás',
  'Desabamento',
  'Outros',
];

export default function NewIncidentScreen({ navigation }) {
  const { saveIncident } = useIncidents();
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    requestPermissions();
    getCurrentLocation();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus === 'granted');

      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Permissão de localização é necessária para registrar ocorrências.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Reverse geocoding to get address
      const [addressData] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressData) {
        const fullAddress = `${addressData.street || ''} ${
          addressData.name || ''
        }, ${addressData.city || ''}, ${addressData.region || ''}`.trim();
        setAddress(fullAddress);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newPhotos = result.assets.map((asset) => asset.uri);
        setPhotos([...photos, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error picking photos:', error);
      Alert.alert('Erro', 'Não foi possível selecionar fotos.');
    }
  };

  const takeVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled) {
        setVideos([...videos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking video:', error);
      Alert.alert('Erro', 'Não foi possível gravar o vídeo.');
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!incidentType) {
      Alert.alert('Erro', 'Selecione o tipo de ocorrência.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erro', 'Digite a descrição da ocorrência.');
      return;
    }

    setLoading(true);

    try {
      const incidentData = {
        incidentType,
        description: description.trim(),
        dateTime: new Date().toISOString(),
        location,
        address,
        photos,
        videos,
        signature,
      };

      const result = await saveIncident(incidentData);

      if (result.success) {
        Alert.alert(
          'Sucesso',
          'Ocorrência registrada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível salvar a ocorrência.');
      }
    } catch (error) {
      console.error('Error submitting incident:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a ocorrência.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Tipo de Ocorrência *</Text>
        <View style={styles.typeContainer}>
          {INCIDENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                incidentType === type && styles.typeButtonActive,
              ]}
              onPress={() => setIncidentType(type)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  incidentType === type && styles.typeButtonTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Descreva a ocorrência detalhadamente..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Localização</Text>
        {location ? (
          <View style={styles.locationBox}>
            <Text style={styles.locationText}>
              📍 Lat: {location.latitude.toFixed(6)}, Lng:{' '}
              {location.longitude.toFixed(6)}
            </Text>
            {address && (
              <Text style={styles.addressText}>{address}</Text>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={getCurrentLocation}
          >
            <Text style={styles.buttonText}>📍 Obter Localização</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fotos</Text>
        <View style={styles.mediaButtons}>
          <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
            <Text style={styles.buttonText}>📷 Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton} onPress={pickPhoto}>
            <Text style={styles.buttonText}>🖼️ Galeria</Text>
          </TouchableOpacity>
        </View>
        {photos.length > 0 && (
          <View style={styles.mediaGrid}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri }} style={styles.photoThumbnail} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vídeos</Text>
        <TouchableOpacity style={styles.button} onPress={takeVideo}>
          <Text style={styles.buttonText}>🎥 Gravar Vídeo</Text>
        </TouchableOpacity>
        {videos.length > 0 && (
          <View style={styles.videoList}>
            {videos.map((uri, index) => (
              <View key={index} style={styles.videoItem}>
                <Text style={styles.videoText}>📹 Vídeo {index + 1}</Text>
                <TouchableOpacity onPress={() => removeVideo(index)}>
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Assinatura Digital</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Signature', { 
            onSignature: (sig) => setSignature(sig) 
          })}
        >
          <Text style={styles.buttonText}>
            {signature ? '✓ Assinatura Capturada' : '✍️ Adicionar Assinatura'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Salvando...' : 'Registrar Ocorrência'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  typeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typeButtonActive: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  typeButtonText: {
    color: '#666',
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  locationBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#4169E1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    backgroundColor: '#4169E1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -4,
  },
  mediaItem: {
    width: '31%',
    margin: '1%',
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoList: {
    marginTop: 12,
  },
  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoText: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#C41E3A',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

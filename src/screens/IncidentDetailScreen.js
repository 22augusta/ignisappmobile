import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function IncidentDetailScreen({ route }) {
  const { incident } = route.params;

  const openMap = () => {
    if (incident.location_lat && incident.location_lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${incident.location_lat},${incident.location_lng}`;
      Linking.openURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'in_progress':
        return '#4169E1';
      case 'completed':
        return '#32CD32';
      default:
        return '#808080';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{incident.incident_type}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(incident.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(incident.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>
          {new Date(incident.date_time).toLocaleString('pt-BR')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{incident.description}</Text>
      </View>

      {(incident.location_lat || incident.address) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          {incident.location_lat && incident.location_lng && (
            <TouchableOpacity onPress={openMap}>
              <Text style={styles.locationText}>
                📍 Lat: {incident.location_lat.toFixed(6)}, Lng:{' '}
                {incident.location_lng.toFixed(6)}
              </Text>
              <Text style={styles.linkText}>Abrir no Maps</Text>
            </TouchableOpacity>
          )}
          {incident.address && (
            <Text style={styles.addressText}>{incident.address}</Text>
          )}
        </View>
      )}

      {incident.photos && incident.photos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Fotos ({incident.photos.length})
          </Text>
          <View style={styles.photoGrid}>
            {incident.photos.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.photo}
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      )}

      {incident.videos && incident.videos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Vídeos ({incident.videos.length})
          </Text>
          {incident.videos.map((uri, index) => (
            <View key={index} style={styles.videoItem}>
              <Text style={styles.videoText}>📹 Vídeo {index + 1}</Text>
            </View>
          ))}
        </View>
      )}

      {incident.signature && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assinatura Digital</Text>
          <Image
            source={{ uri: incident.signature }}
            style={styles.signature}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações do Registro</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Criado em:</Text>
          <Text style={styles.infoValue}>
            {new Date(incident.created_at).toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Atualizado em:</Text>
          <Text style={styles.infoValue}>
            {new Date(incident.updated_at).toLocaleString('pt-BR')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status de Sincronização:</Text>
          <Text style={[styles.infoValue, { color: incident.synced ? '#32CD32' : '#FFA500' }]}>
            {incident.synced ? '✓ Sincronizado' : '⚠ Não Sincronizado'}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#4169E1',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photo: {
    width: '31%',
    height: 100,
    margin: '1%',
    borderRadius: 8,
  },
  videoItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoText: {
    fontSize: 14,
    color: '#666',
  },
  signature: {
    width: '100%',
    height: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
});

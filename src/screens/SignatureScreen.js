import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

export default function SignatureScreen({ navigation, route }) {
  const signatureRef = useRef();
  const { onSignature } = route.params || {};

  const handleOK = (signature) => {
    if (onSignature) {
      onSignature(signature);
    }
    navigation.goBack();
  };

  const handleEmpty = () => {
    Alert.alert('Atenção', 'Por favor, adicione uma assinatura antes de salvar.');
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assinatura Digital</Text>
        <Text style={styles.subtitle}>
          Assine na área abaixo usando seu dedo
        </Text>
      </View>

      <View style={styles.signatureContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleOK}
          onEmpty={handleEmpty}
          onEnd={handleEnd}
          descriptionText=""
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={style}
          autoClear={false}
          imageType="image/png"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClear}
        >
          <Text style={styles.buttonText}>Limpar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleEnd}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#C41E3A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  signatureContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    margin: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  clearButton: {
    backgroundColor: '#808080',
  },
  saveButton: {
    backgroundColor: '#C41E3A',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

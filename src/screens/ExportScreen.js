import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useIncidents } from '../contexts/IncidentContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ExportScreen() {
  const { incidents } = useIncidents();
  const [exporting, setExporting] = useState(false);

  const exportToJSON = async () => {
    try {
      setExporting(true);
      
      const jsonData = JSON.stringify(incidents, null, 2);
      const filename = `ocorrencias_cbmpe_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, jsonData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sucesso', `Dados exportados para ${filename}`);
      }
    } catch (error) {
      console.error('Error exporting JSON:', error);
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);

      // CSV headers
      let csv = 'ID,Tipo,Descrição,Data/Hora,Latitude,Longitude,Endereço,Status,Sincronizado\n';

      // CSV rows
      incidents.forEach((incident) => {
        csv += `${incident.id},"${incident.incident_type}","${incident.description.replace(/"/g, '""')}","${incident.date_time}",${incident.location_lat || ''},${incident.location_lng || ''},"${incident.address || ''}",${incident.status},${incident.synced ? 'Sim' : 'Não'}\n`;
      });

      const filename = `ocorrencias_cbmpe_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, csv);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sucesso', `Dados exportados para ${filename}`);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    } finally {
      setExporting(false);
    }
  };

  const shareStatistics = async () => {
    try {
      const total = incidents.length;
      const synced = incidents.filter(i => i.synced).length;
      const unsynced = total - synced;

      const typeCount = {};
      incidents.forEach(incident => {
        typeCount[incident.incident_type] = (typeCount[incident.incident_type] || 0) + 1;
      });

      let message = `📊 Estatísticas CBMPE - ${new Date().toLocaleDateString('pt-BR')}\n\n`;
      message += `Total de Ocorrências: ${total}\n`;
      message += `Sincronizadas: ${synced}\n`;
      message += `Não Sincronizadas: ${unsynced}\n\n`;
      message += `Ocorrências por Tipo:\n`;
      
      Object.entries(typeCount).forEach(([type, count]) => {
        message += `• ${type}: ${count}\n`;
      });

      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing statistics:', error);
    }
  };

  const getStatistics = () => {
    const total = incidents.length;
    const synced = incidents.filter(i => i.synced).length;
    const unsynced = total - synced;

    const typeCount = {};
    incidents.forEach(incident => {
      typeCount[incident.incident_type] = (typeCount[incident.incident_type] || 0) + 1;
    });

    return { total, synced, unsynced, typeCount };
  };

  const stats = getStatistics();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exportar Dados</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#32CD32' }]}>
              {stats.synced}
            </Text>
            <Text style={styles.statLabel}>Sincronizadas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#FFA500' }]}>
              {stats.unsynced}
            </Text>
            <Text style={styles.statLabel}>Não Sincronizadas</Text>
          </View>
        </View>

        <View style={styles.typeStats}>
          <Text style={styles.typeStatsTitle}>Por Tipo de Ocorrência:</Text>
          {Object.entries(stats.typeCount).map(([type, count]) => (
            <View key={type} style={styles.typeRow}>
              <Text style={styles.typeText}>{type}</Text>
              <Text style={styles.typeCount}>{count}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opções de Exportação</Text>

        <TouchableOpacity
          style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
          onPress={exportToJSON}
          disabled={exporting}
        >
          <Text style={styles.exportButtonIcon}>📄</Text>
          <View style={styles.exportButtonContent}>
            <Text style={styles.exportButtonTitle}>Exportar como JSON</Text>
            <Text style={styles.exportButtonDesc}>
              Formato completo com todos os dados
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
          onPress={exportToCSV}
          disabled={exporting}
        >
          <Text style={styles.exportButtonIcon}>📊</Text>
          <View style={styles.exportButtonContent}>
            <Text style={styles.exportButtonTitle}>Exportar como CSV</Text>
            <Text style={styles.exportButtonDesc}>
              Formato compatível com Excel e planilhas
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exportButton}
          onPress={shareStatistics}
        >
          <Text style={styles.exportButtonIcon}>📤</Text>
          <View style={styles.exportButtonContent}>
            <Text style={styles.exportButtonTitle}>Compartilhar Estatísticas</Text>
            <Text style={styles.exportButtonDesc}>
              Compartilhar resumo via aplicativos
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>
          Os dados exportados incluem todas as ocorrências registradas localmente.
          Para exportar dados do servidor central, utilize o sistema web do CBMPE.
        </Text>
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
    backgroundColor: '#C41E3A',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#C41E3A',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  typeStats: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  typeStatsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  typeText: {
    fontSize: 14,
    color: '#333',
  },
  typeCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C41E3A',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  exportButtonIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  exportButtonContent: {
    flex: 1,
  },
  exportButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exportButtonDesc: {
    fontSize: 12,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
});

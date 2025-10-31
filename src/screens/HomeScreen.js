import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useIncidents } from '../contexts/IncidentContext';

export default function HomeScreen({ navigation }) {
  const { incidents, loading, syncing, loadIncidents, sync } = useIncidents();

  const handleSync = async () => {
    const result = await sync();
    if (result.success) {
      Alert.alert(
        'Sincronização Completa',
        `${result.synced} ocorrências sincronizadas com sucesso.`
      );
    } else {
      Alert.alert(
        'Erro na Sincronização',
        result.error || 'Não foi possível sincronizar os dados.'
      );
    }
  };

  const renderIncident = ({ item }) => (
    <TouchableOpacity
      style={styles.incidentCard}
      onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
    >
      <View style={styles.incidentHeader}>
        <Text style={styles.incidentType}>{item.incident_type}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.incidentDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.incidentDate}>
        {new Date(item.date_time).toLocaleString('pt-BR')}
      </Text>
      {item.address && (
        <Text style={styles.incidentAddress} numberOfLines={1}>
          📍 {item.address}
        </Text>
      )}
      {!item.synced && (
        <Text style={styles.unsyncedLabel}>⚠️ Não sincronizado</Text>
      )}
    </TouchableOpacity>
  );

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ocorrências CBMPE</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={syncing}
          >
            <Text style={styles.syncButtonText}>
              {syncing ? '🔄 Sincronizando...' : '🔄 Sincronizar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={incidents}
        renderItem={renderIncident}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadIncidents} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma ocorrência registrada
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewIncident')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  syncButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    color: '#C41E3A',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  incidentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  incidentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  incidentDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  incidentAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  unsyncedLabel: {
    fontSize: 12,
    color: '#FFA500',
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C41E3A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});

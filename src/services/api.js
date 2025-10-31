import axios from 'axios';
import { getUnsyncedIncidents, markIncidentAsSynced } from './database';

// Configure this URL to point to CBMPE's central database API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.cbmpe.gov.br';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token if available
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const syncIncidents = async () => {
  try {
    const unsyncedIncidents = await getUnsyncedIncidents();
    
    if (unsyncedIncidents.length === 0) {
      return { success: true, synced: 0 };
    }

    const results = await Promise.allSettled(
      unsyncedIncidents.map(incident => 
        api.post('/incidents', incident)
          .then(() => markIncidentAsSynced(incident.id))
      )
    );

    const synced = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      success: failed === 0,
      synced,
      failed,
      total: unsyncedIncidents.length
    };
  } catch (error) {
    console.error('Error syncing incidents:', error);
    return { success: false, error: error.message };
  }
};

export const uploadMedia = async (uri, type = 'image') => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: type === 'image' ? 'image/jpeg' : 'video/mp4',
      name: `media_${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`
    });

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

export const exportData = async (filters = {}) => {
  try {
    const response = await api.get('/incidents/export', {
      params: filters,
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const getIncidentStats = async () => {
  try {
    const response = await api.get('/incidents/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    const { token, user } = response.data;
    
    if (token) {
      setAuthToken(token);
    }
    
    return { token, user };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export default api;

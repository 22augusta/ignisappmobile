import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllIncidents, saveIncident as dbSaveIncident } from '../services/database';
import { syncIncidents } from '../services/api';
import logger from '../utils/logger';

const IncidentContext = createContext();

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await getAllIncidents();
      setIncidents(data);
    } catch (error) {
      logger.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveIncident = async (incidentData) => {
    try {
      const id = await dbSaveIncident(incidentData);
      await loadIncidents();
      return { success: true, id };
    } catch (error) {
      logger.error('Error saving incident:', error);
      return { success: false, error: error.message };
    }
  };

  const sync = async () => {
    try {
      setSyncing(true);
      const result = await syncIncidents();
      await loadIncidents();
      return result;
    } catch (error) {
      logger.error('Error syncing:', error);
      return { success: false, error: error.message };
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        loading,
        syncing,
        saveIncident,
        loadIncidents,
        sync,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

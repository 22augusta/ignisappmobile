import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('ignis.db');
    
    // Create incidents table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_type TEXT NOT NULL,
        description TEXT NOT NULL,
        date_time TEXT NOT NULL,
        location_lat REAL,
        location_lng REAL,
        address TEXT,
        status TEXT DEFAULT 'pending',
        photos TEXT,
        videos TEXT,
        signature TEXT,
        synced INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const saveIncident = async (incidentData) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO incidents (incident_type, description, date_time, location_lat, location_lng, address, photos, videos, signature, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        incidentData.incidentType,
        incidentData.description,
        incidentData.dateTime,
        incidentData.location?.latitude || null,
        incidentData.location?.longitude || null,
        incidentData.address || '',
        JSON.stringify(incidentData.photos || []),
        JSON.stringify(incidentData.videos || []),
        incidentData.signature || '',
        'pending'
      ]
    );
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error saving incident:', error);
    throw error;
  }
};

export const getAllIncidents = async () => {
  try {
    const incidents = await db.getAllAsync('SELECT * FROM incidents ORDER BY created_at DESC');
    return incidents.map(incident => ({
      ...incident,
      photos: JSON.parse(incident.photos || '[]'),
      videos: JSON.parse(incident.videos || '[]')
    }));
  } catch (error) {
    console.error('Error getting incidents:', error);
    throw error;
  }
};

export const getIncidentById = async (id) => {
  try {
    const incident = await db.getFirstAsync('SELECT * FROM incidents WHERE id = ?', [id]);
    if (incident) {
      return {
        ...incident,
        photos: JSON.parse(incident.photos || '[]'),
        videos: JSON.parse(incident.videos || '[]')
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting incident:', error);
    throw error;
  }
};

export const updateIncidentStatus = async (id, status) => {
  try {
    await db.runAsync(
      'UPDATE incidents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
  } catch (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }
};

export const markIncidentAsSynced = async (id) => {
  try {
    await db.runAsync(
      'UPDATE incidents SET synced = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  } catch (error) {
    console.error('Error marking incident as synced:', error);
    throw error;
  }
};

export const getUnsyncedIncidents = async () => {
  try {
    const incidents = await db.getAllAsync('SELECT * FROM incidents WHERE synced = 0');
    return incidents.map(incident => ({
      ...incident,
      photos: JSON.parse(incident.photos || '[]'),
      videos: JSON.parse(incident.videos || '[]')
    }));
  } catch (error) {
    console.error('Error getting unsynced incidents:', error);
    throw error;
  }
};

export const deleteIncident = async (id) => {
  try {
    await db.runAsync('DELETE FROM incidents WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting incident:', error);
    throw error;
  }
};

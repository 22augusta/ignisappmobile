# API Integration Documentation

## Overview

The IGNIS mobile application integrates with CBMPE's central database through a REST API. This document describes the expected API endpoints and data formats.

## Base URL

Configure the base URL in your `.env` file:
```
EXPO_PUBLIC_API_URL=https://api.cbmpe.gov.br
```

## Authentication

All API requests (except login) require authentication using JWT tokens in the Authorization header:

```
Authorization: Bearer {token}
```

## Endpoints

### Authentication

#### POST /auth/login
Login to the system

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "number",
    "username": "string",
    "name": "string",
    "role": "string"
  }
}
```

### Incidents

#### POST /incidents
Create a new incident (sync from mobile)

**Request:**
```json
{
  "incident_type": "string",
  "description": "string",
  "date_time": "string (ISO 8601)",
  "location_lat": "number",
  "location_lng": "number",
  "address": "string",
  "photos": ["string (URIs)"],
  "videos": ["string (URIs)"],
  "signature": "string (base64 image)",
  "status": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "success": true
}
```

#### GET /incidents
List all incidents

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `from_date` (optional): Filter from date
- `to_date` (optional): Filter to date

**Response:**
```json
{
  "incidents": [
    {
      "id": "number",
      "incident_type": "string",
      "description": "string",
      "date_time": "string",
      "location_lat": "number",
      "location_lng": "number",
      "address": "string",
      "status": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### GET /incidents/:id
Get incident details

**Response:**
```json
{
  "id": "number",
  "incident_type": "string",
  "description": "string",
  "date_time": "string",
  "location_lat": "number",
  "location_lng": "number",
  "address": "string",
  "photos": ["string"],
  "videos": ["string"],
  "signature": "string",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### PATCH /incidents/:id
Update incident status

**Request:**
```json
{
  "status": "pending | in_progress | completed"
}
```

**Response:**
```json
{
  "success": true
}
```

### Media Upload

#### POST /upload
Upload photos or videos

**Request:**
- Content-Type: multipart/form-data
- Field name: `file`

**Response:**
```json
{
  "url": "string (public URL)",
  "filename": "string"
}
```

### Statistics

#### GET /incidents/stats
Get incident statistics

**Query Parameters:**
- `from_date` (optional): Start date
- `to_date` (optional): End date

**Response:**
```json
{
  "total": "number",
  "by_type": {
    "Incêndio": "number",
    "Acidente de Trânsito": "number",
    ...
  },
  "by_status": {
    "pending": "number",
    "in_progress": "number",
    "completed": "number"
  }
}
```

### Export

#### GET /incidents/export
Export incidents data

**Query Parameters:**
- `format`: `json` or `csv`
- `from_date` (optional): Start date
- `to_date` (optional): End date

**Response:**
- Content-Type: application/json or text/csv
- File download

## Error Handling

All API endpoints should return errors in the following format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Offline Support

The mobile application implements offline-first functionality:

1. All incidents are stored locally in SQLite database
2. When online, the app automatically syncs unsynced incidents to the server
3. Sync is triggered:
   - When the app starts
   - When the user manually triggers sync
   - When network connectivity is restored

## Data Validation

### Incident Types
Valid values for `incident_type`:
- Incêndio
- Acidente de Trânsito
- Resgate
- Emergência Médica
- Vazamento de Gás
- Desabamento
- Outros

### Status
Valid values for `status`:
- `pending`: Pendente
- `in_progress`: Em Andamento
- `completed`: Concluído

## Security Considerations

1. All API calls must use HTTPS
2. JWT tokens should expire after a reasonable time (e.g., 24 hours)
3. Refresh tokens should be implemented for long sessions
4. Media files should be scanned for malware
5. Rate limiting should be implemented to prevent abuse
6. Input validation is required on all endpoints

## Testing

For development and testing, you can use mock API responses or set up a local development server.

Example local server URL:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Future Enhancements

- WebSocket support for real-time updates
- Push notifications via Firebase Cloud Messaging
- GraphQL API option for more efficient data fetching
- Batch upload for multiple media files
- Image compression before upload

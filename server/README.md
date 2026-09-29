# Face Profile Discovery System - Backend Server

Java Spring Boot backend service implementing security, authentication, JWT session management, image upload validation, REST endpoints, and orchestration with internal Python AI processing service.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Search
- `POST /api/search` (Multipart file upload)
- `GET /api/search`
- `GET /api/search/{searchId}`
- `DELETE /api/search/{searchId}`

### Results
- `GET /api/search/{searchId}/results`
- `GET /api/results/{resultId}`

### Admin
- `GET /api/admin/users`
- `PATCH /api/admin/users/{userId}/status`
- `GET /api/admin/audit-logs`

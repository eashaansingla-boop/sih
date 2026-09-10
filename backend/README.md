# Coal Mine Governance API

Backend API for the **AI-Based Smart Governance & Compliance Monitoring System for Coal Mines** — an Internal Smart India Hackathon (SIH) project.

## Purpose

This backend provides REST APIs for monitoring coal mine compliance, safety inspections, violations, contractor management, AI-driven risk assessment, alerts, GIS data, and role-based dashboards for mine officials, corporate management, and regulatory authorities.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript
- **Database:** Not finalized (PostgreSQL or MongoDB)
- **Frontend:** Developed separately

## Backend Architecture

```
Client
   ↓
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Services (planned)
   ↓
Models / Database (planned)
   ↓
External APIs / AI / Other systems (planned)
```

**Current phase:** Routes → Controllers → Placeholder JSON responses.

## Folder Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request/response handlers
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, roles, error handling
│   ├── services/        # Business logic (planned)
│   ├── models/          # Database models (planned)
│   ├── utils/           # Shared utilities
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Modules

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Login, logout, current user |
| Documents | `/api/documents` | Document management, OCR, reports |
| Monitoring | `/api/inspections`, `/api/observations`, etc. | Real-time monitoring |
| Compliance | `/api/compliance`, `/api/mines` | Compliance rules and records |
| Contractors | `/api/contractors`, `/api/contracts` | Contractor management |
| AI & Analytics | `/api/ai` | Risk assessment, anomalies |
| Alerts | `/api/alerts`, `/api/reminders`, `/api/escalations` | Alerts and workflow |
| GIS | `/api/gis` | Geo-tagged data |
| Dashboard | `/api/dashboard` | Role-based dashboards |
| Audit Logs | `/api/audit-logs` | Audit trail |

## Installation

```bash
cd backend
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

## Running the Server

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## Health Check

```bash
GET /api/health
```

Response:

```json
{
    "success": true,
    "message": "Coal Mine Governance API is running"
}
```

## Current Development Status

**This is currently the backend API skeleton.** Controllers contain placeholder responses. Database, authentication, AI, OCR, GIS, business logic, and external integrations will be implemented in subsequent development phases.

All API endpoints are defined and connected. The architecture is ready for:

- PostgreSQL or MongoDB integration
- JWT authentication and role-based access control
- Service layer business logic
- AI/ML risk and anomaly models
- OCR and document processing
- GIS spatial data handling
- Notification and alert systems

## License

ISC

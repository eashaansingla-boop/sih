# Services Layer

The service layer will contain business logic and orchestrate operations between controllers, models, and external systems.

## Planned Services

| Service | Responsibility |
|---------|----------------|
| `authService` | Authentication, token management, user sessions |
| `documentService` | Document upload, storage, OCR processing |
| `inspectionService` | Inspection workflows and validation |
| `complianceService` | Compliance rules, records, and status tracking |
| `contractorService` | Contractor and contract management |
| `riskService` | AI-based risk assessment calculations |
| `anomalyService` | Anomaly detection and analysis |
| `alertService` | Alerts, reminders, and escalations |
| `gisService` | Geo-tagged data and spatial queries |
| `dashboardService` | Aggregated dashboard metrics |
| `auditService` | Audit trail logging and retrieval |

## Architecture

```
Controller → Service → Model / External API
```

Services will be implemented in subsequent development phases after the database and external integrations are finalized.

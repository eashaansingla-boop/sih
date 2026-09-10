# AI-Based Smart Governance & Compliance Monitoring System for Coal Mines

An integrated system developed for the Smart India Hackathon (SIH) to monitor, audit, and enforce safety, regulatory compliance, and contractor performance across coal mining operations.

## 🚀 Overview

This platform centralizes coal mine operations oversight by providing:
- **Interactive Multi-Role Dashboards**: Specialized views for Mine Officials, Corporate Management, Regulators, and Contractors.
- **GIS Map & Spatial Tracking**: Live geospatial tracking of coal mine concessions, hazard zones, and environmental sensors.
- **AI-Powered Risk & Anomaly Assessment**: Predictive safety indexes, risk heatmaps, and automated hazard classification.
- **Automated Field Reporting**: Offline-ready inspection workflows and corrective action checklists.
- **OCR Studio**: Digitization and automated analysis of physical safety permits, inspection logs, and compliance certificates.
- **AI Chatbot / Assistant**: Natural language querying for mining safety rules (DGMS guidelines), past incident records, and compliance requirements.
- **Immutable Audit Trail**: Chronological event logs for compliance verification and regulatory audits.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet / React-Leaflet
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase / PostgreSQL (with in-memory data store fallback)
- **OCR**: Tesseract.js integration

### Datasets & Schema
- `datasets/`: AI training templates and feature datasets (`common_mine_ai_training_template.csv`, `model_feature_dataset.csv`, `data_dictionary.md`)
- `supabase_schema.sql`: Full database schema definitions and seed structures

---

## 📁 Repository Structure

```
.
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # Database & Supabase connection
│   │   ├── controllers/      # Route controllers (AI, GIS, Auth, Compliance, etc.)
│   │   ├── middleware/       # Auth & error handling
│   │   ├── models/           # Data store & schemas
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helper utilities
│   │   ├── app.js            # Express application setup
│   │   └── server.js         # Entry point
│   ├── .env.example          # Sample environment configuration
│   └── package.json
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Dashboards, GIS map, OCR, Chatbot, etc.
│   │   ├── App.jsx           # Main application shell
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── datasets/                 # Mining datasets & AI models dictionary
├── supabase_schema.sql       # Database schema
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env     # configure credentials if connecting to Supabase
npm run dev
```
The backend will run on `http://localhost:5000` by default.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173` by default.

---

## 📄 License
ISC

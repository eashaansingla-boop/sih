const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth.routes");
const documentsRoutes = require("./routes/documents.routes");
const monitoringRoutes = require("./routes/monitoring.routes");
const complianceRoutes = require("./routes/compliance.routes");
const contractorsRoutes = require("./routes/contractors.routes");
const aiRoutes = require("./routes/ai.routes");
const alertsRoutes = require("./routes/alerts.routes");
const gisRoutes = require("./routes/gis.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const auditLogsRoutes = require("./routes/auditLogs.routes");

const notFoundMiddleware = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Coal Mine Governance API is running",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api", monitoringRoutes);
app.use("/api", complianceRoutes);
app.use("/api", contractorsRoutes);
app.use("/api", aiRoutes);
app.use("/api", alertsRoutes);
app.use("/api", gisRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", auditLogsRoutes);

// Serve Frontend static assets if built
const frontendDist = path.join(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;

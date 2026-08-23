const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const companyInvitationRoutes = require("./routes/companyInvitation.routes");
const companyEmployeeRoutes = require("./routes/companyEmployee.routes");
const customerRoutes = require("./routes/customer.routes");
const customerContactRoutes = require("./routes/customerContact.routes");
const leadRoutes = require("./routes/lead.routes");
const pipelineRoutes = require("./routes/pipeline.routes");
const pipelineStageRoutes = require("./routes/pipelineStage.routes");
const dealRoutes = require("./routes/deal.routes");
const taskRoutes = require("./routes/task.routes");
const meetingRoutes = require("./routes/meeting.routes");
const noteRoutes = require("./routes/note.routes");
const attachmentRoutes = require("./routes/attachment.routes");
const activityRoutes = require("./routes/activity.routes");
const notificationRoutes = require("./routes/notification.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const searchRoutes = require("./routes/search.routes");
const reportRoutes = require("./routes/report.routes");
const { serve, setup } = require("./docs");
// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (e.g. HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing for all origins
app.use(cors());

// Set secure HTTP response headers
app.use(helmet());

// Log HTTP requests in the "dev" format during development
app.use(morgan("dev"));

// Parse cookies attached to incoming requests
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/company-invitations", companyInvitationRoutes);
app.use("/api/company-employees", companyEmployeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customer-contacts", customerContactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/pipelines", pipelineRoutes);
app.use("/api/pipeline-stages", pipelineStageRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/reports", reportRoutes);

// Interactive API documentation (OpenAPI 3.0 / Swagger UI)
app.use("/api/docs", serve, setup);

// Raw OpenAPI JSON spec
app.get("/api/docs.json", (req, res) => {
  res.status(200).json(require("./docs").swaggerSpec);
});

// Root health-check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CRM Backend API is running",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`✗ ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;

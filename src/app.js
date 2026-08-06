const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const customerRoutes = require("./routes/customer.routes");
const customerContactRoutes = require("./routes/customerContact.routes");
const leadRoutes = require("./routes/lead.routes");
const pipelineRoutes = require("./routes/pipeline.routes");
const pipelineStageRoutes = require("./routes/pipelineStage.routes");
const dealRoutes = require("./routes/deal.routes");
const taskRoutes = require("./routes/task.routes");
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
app.use("/api/customers", customerRoutes);
app.use("/api/customer-contacts", customerContactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/pipelines", pipelineRoutes);
app.use("/api/pipeline-stages", pipelineStageRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/tasks", taskRoutes);

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

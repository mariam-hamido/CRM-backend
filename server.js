require("dotenv").config();

const http = require("http");

const validateEnvironment = require("./src/config/env");
const { connectDB, disconnectDB } = require("./src/config/db");
const {
  initSocketServer,
  closeSocketServer,
} = require("./src/realtime/socket.server");

const bootstrap = async () => {
  const env = validateEnvironment();
  console.log("✓ Environment Loaded");

  await connectDB(env.mongodbUri);

  const app = require("./src/app");

  const server = http.createServer(app);

  initSocketServer(server);

  server.listen(env.port, () => {
    console.log("✓ Express Started");
    console.log(`✓ Server Listening on Port ${env.port}`);
  });

  let isShuttingDown = false;

  const shutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n${signal} received. Shutting down gracefully...`);

    server.closeIdleConnections();

    try {
      await closeSocketServer();
    } catch (error) {
      console.error(`✗ Error while closing socket server: ${error.message}`);
    }

    try {
      await disconnectDB();
      console.log("✓ Graceful shutdown complete");
      process.exit(0);
    } catch (dbError) {
      console.error(
        `✗ Failed to close MongoDB connection: ${dbError.message}`
      );
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

bootstrap().catch((error) => {
  console.error(`✗ Server failed to start: ${error.message}`);
  process.exit(1);
});

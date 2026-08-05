require("dotenv").config();

const validateEnvironment = require("./src/config/env");
const { connectDB, disconnectDB } = require("./src/config/db");

const bootstrap = async () => {
  const env = validateEnvironment();
  console.log("✓ Environment Loaded");

  await connectDB(env.mongodbUri);

  const app = require("./src/app");

  const server = app.listen(env.port, () => {
    console.log("✓ Express Started");
    console.log(`✓ Server Listening on Port ${env.port}`);
  });

  let isShuttingDown = false;

  const shutdown = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n${signal} received. Shutting down gracefully...`);

    server.close(async (error) => {
      if (error) {
        console.error(`✗ Error while closing server: ${error.message}`);
        process.exit(1);
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
    });

    // Close idle keep-alive connections so server.close resolves promptly
    server.closeIdleConnections();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

bootstrap().catch((error) => {
  console.error(`✗ Server failed to start: ${error.message}`);
  process.exit(1);
});

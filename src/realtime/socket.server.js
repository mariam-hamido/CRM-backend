const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const USER_ROOM_PREFIX = "user:";

let io = null;

const extractHandshakeToken = (socket) => {
  const authHeader = socket.handshake.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  if (socket.handshake.auth && socket.handshake.auth.token) {
    return socket.handshake.auth.token;
  }

  return null;
};

const authenticateSocket = async (socket) => {
  const token = extractHandshakeToken(socket);

  if (!token) {
    throw new Error("No token provided");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const user = await authenticateSocket(socket);

      socket.data.userId = String(user._id);
      socket.data.companyId = String(user.company);

      next();
    } catch (error) {
      console.error(`✗ Socket authentication failed: ${error.message}`);
      next(new Error(error.message));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket.data;

    socket.join(`${USER_ROOM_PREFIX}${userId}`);

    console.log(`✓ Socket connected for user ${userId}`);

    socket.on("disconnect", (reason) => {
      console.log(`✓ Socket disconnected for user ${userId} (${reason})`);
    });
  });

  console.log("✓ Socket.IO Initialized");

  return io;
};

const getIO = () => io;

const emitToUser = (userId, event, payload) => {
  if (!io || !userId) {
    return false;
  }

  io.to(`${USER_ROOM_PREFIX}${String(userId)}`).emit(event, payload);

  return true;
};

const closeSocketServer = async () => {
  if (!io) {
    return null;
  }

  const result = await new Promise((resolve) => {
    io.close((error) => resolve(error));
  });

  io = null;

  return result;
};

module.exports = {
  USER_ROOM_PREFIX,
  initSocketServer,
  getIO,
  emitToUser,
  closeSocketServer,
};

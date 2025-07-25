import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import app from "./app.js";
<<<<<<< HEAD
import registerSocketRoute from './src/socket/webSocket.js';
=======
import registerSocketRoute from './webSocket.js';
>>>>>>> 9c7d6f6b849df4ec3a5ea1126e6c616d1c11ba95

dotenv.config()

const PORT = process.env.PORT;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_SETTING || '*',
  }
});

// SocketIO Route
registerSocketRoute(io);

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});
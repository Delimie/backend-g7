import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import app from "./app.js";
<<<<<<< HEAD
import registerSocketRoute from './src/socket/webSocket.js';
>>>>>>> 07338de (add socket.on uesrtyping event, refactor socket folder structure separate handlers and event)

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
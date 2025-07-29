import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import app from "./app.js";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import registerSocketRoute from './src/socket/webSocket.js';
=======
import registerSocketRoute from './webSocket.js';
>>>>>>> 6435de3 (add socket disconnection event)
=======
import registerSocketRoute from './webSocket.js';
>>>>>>> 1a3f9c9 (add socket disconnection event)
=======
import registerSocketRoute from './src/socket/webSocket.js';
=======
import registerSocketRoute from './webSocket.js';
>>>>>>> 9c7d6f6b849df4ec3a5ea1126e6c616d1c11ba95
>>>>>>> a82853ff7e7ef60d16259d46333cacf008c2af86

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
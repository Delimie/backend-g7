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
<<<<<<< HEAD
>>>>>>> 6435de3 (add socket disconnection event)
=======
import registerSocketRoute from './webSocket.js';
=======
>>>>>>> edb312f7602b17f888dd9dad5a2a411cd3cf9708
>>>>>>> 1a3f9c9 (add socket disconnection event)
=======
import registerSocketRoute from './src/socket/webSocket.js';
>>>>>>> 6962f8e (Clean up git)
<<<<<<< HEAD
=======
=======
import registerSocketRoute from './src/socket/webSocket.js';
>>>>>>> 6962f8e3f0e60d824d2e0331dfc97911bfe799ab
>>>>>>> edb312f7602b17f888dd9dad5a2a411cd3cf9708

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
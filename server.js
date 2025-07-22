import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import app from "./app.js";
import { socketMiddleware } from "./src/middlewares/socket.middleware.js";

dotenv.config()

const PORT = process.env.PORT;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_SETTING,
  }
});

// SocketIO middleware
io.use(socketMiddleware).on('connection', (socket)=>{

console.log(`User : ${socket.id} has join the socket`);

});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
});
import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import notFound from "./src/utils/not-found.js";
import error from "./src/utils/error.js";
import dotenv from 'dotenv';

import { Server } from 'socket.io';
import { createServer, http } from 'http';
import createError from "./src/utils/create-error.js";
import prisma from "./src/config/prisma.config.js";

dotenv.config()

const PORT = process.env.PORT;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_SETTING,
  }
});

// SocketIO middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return createError(null, 'Token is missing')
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      }
    });

    if(!user)  createError(null, `User doesn't exist`);
    
    socket.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";
import jwt from 'jsonwebtoken';

export const socketMiddleware = async (socket, next) => {
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

    if (!user) createError(null, `User doesn't exist`);

    socket.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
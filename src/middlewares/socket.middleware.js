import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";
import jwt from 'jsonwebtoken';

export const socketMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return createError(null, 'Token is missing')
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET, { algorithms: ['HS256'] });
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      },
      omit : {
        password,
        profileImage,
        coverImage,
        occupation,
        address,
        createdAt,
        updatedAt,
      }
    });

    if (!user) createError(null, `User doesn't exist`);

    socket.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
import prisma from "../config/prisma.config.js";
import jwt from 'jsonwebtoken';
import createSocketError from "../utils/create-error-socket.js";

export const socketMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(createSocketError(401,`Token is missing`));
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET, { algorithms: ['HS256'] });
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      },
      omit : {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 94a266b (Add createSocketError, fix omit prisma, successful connection to client side)
        password : true,
        profileImage : true,
        coverImage : true,
        occupation : true,
        address : true,
        createdAt : true,
        updatedAt : true,
<<<<<<< HEAD
=======
        password,
        profileImage,
        coverImage,
        occupation,
        address,
        createdAt,
        updatedAt,
>>>>>>> 0227a74 (add socket disconnection event)
=======
>>>>>>> 94a266b (Add createSocketError, fix omit prisma, successful connection to client side)
      }
    });

    if (!user) next(createSocketError(400,`User doesn't exist`));

    socket.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}
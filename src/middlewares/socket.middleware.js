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
<<<<<<< HEAD
=======
>>>>>>> edb312f7602b17f888dd9dad5a2a411cd3cf9708
        password : true,
        profileImage : true,
        coverImage : true,
        occupation : true,
        address : true,
        createdAt : true,
        updatedAt : true,
<<<<<<< HEAD
=======
=======
>>>>>>> 1a3f9c9 (add socket disconnection event)
        password,
        profileImage,
        coverImage,
        occupation,
        address,
        createdAt,
        updatedAt,
<<<<<<< HEAD
>>>>>>> 6435de3 (add socket disconnection event)
=======
>>>>>>> 1a3f9c9 (add socket disconnection event)
=======
>>>>>>> edb312f7602b17f888dd9dad5a2a411cd3cf9708
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
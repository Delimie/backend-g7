import prisma from "../config/prisma.config.js";
import jwt from 'jsonwebtoken';
import createSocketError from "../utils/create-error-socket.js";
import { GROUP_ACTION, USER_ACTION } from "../shared/constants/socket.constant.js";

export const socketMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    // Disconnecting the public user
    setTimeout(() => {
      socket.disconnect(true);
    }, 0);
    return next(createSocketError(401, `Token is missing`));
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET, { algorithms: ['HS256'] });
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id
      },
      omit: {
        gender: true,
        mobile: true,
        qrCode: true,
        password: true,
        profileImage: false,
        occupation: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // If not find user force disconnection
    if (!user) {
      setTimeout(() => {
        socket.disconnect(true);
      }, 0);
      next(createSocketError(400, `User doesn't exist`));
    }

    socket.user = user;
    socket.user.onlineStatus = "ONLINE";
    socket.user.status = true;

    //Join all group that user are in
    const userGroups = await prisma.groupUser.findMany({
      where: { userId: Number(socket.user.id) },
      include: { group: true },
    });
    for (let eachGroup of userGroups) {
      socket.join(`GROUP:${eachGroup.group.id}`);
      // socket.to(`GROUP:${eachGroup.group.id}`).emit(GROUP_ACTION.GROUP_JOIN,{message : `User ${socket.user.name} has connected`, user : socket.user});
      // console.log('Group ID Join : ',eachGroup.group.id);
    }

    // Broadcast to all online user
    socket.broadcast.emit(GROUP_ACTION.GROUP_JOIN,{message : `User ${socket.user.name} has connected`, user : socket.user});

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}
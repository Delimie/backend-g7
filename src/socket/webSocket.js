import prisma from "../config/prisma.config.js";
import { socketMiddleware } from "../middlewares/socket.middleware.js";
import { CHAT_ACTION, GROUP_ACTION } from "../shared/constants/socket.constant.js";
import { channelHandler } from "./socket-handlers/channel.handler.js";
import { chatHandler } from "./socket-handlers/chat.handler.js";
import { groupHandler } from "./socket-handlers/group.handler.js";

const registerSocketRoute = (io) => {
  io.use(socketMiddleware).on('connection',async (socket) => {
    console.log(`User : ${socket.id} has join the socket`);

    // Update user Online status
    if (socket.user.status) {
      await prisma.user.update({ where: { id: socket.user.id }, data: { onlineStatus: "ONLINE" } });
    }

    // TRY TO CHECK JOIN ROOM
    groupHandler(io, socket);
    channelHandler(io, socket);

    chatHandler(io, socket);

    socket.on('disconnect', async (reason) => {
      console.log(`Socket id : ${socket.id} has disconnected reason : ${reason}`);

      // Update user Offline status
      socket.user.status = false;
      socket.user.onlineStatus = "OFFLINE";
      await prisma.user.update({ where: { id: socket.user.id }, data: { onlineStatus: "OFFLINE" } });

      // Handle tell server that User leave
      if(socket.user.onlineStatus === "OFFLINE")socket.broadcast.emit(GROUP_ACTION.GROUP_LEAVE,{message : `User ${socket.user.name} has disconnected`, user : socket.user});

      // Handle tell user has left the chatRoom
      socket.to('ROOMID').emit(CHAT_ACTION.LEAVE_CHAT, {
        message: `${socket.user.name} has left the group`,
        userId: socket.user.name,
      });

    });

  });
}

export default registerSocketRoute;
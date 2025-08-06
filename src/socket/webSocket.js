import prisma from "../config/prisma.config.js";
import { socketMiddleware } from "../middlewares/socket.middleware.js";
import { CHAT_ACTION, GROUP_ACTION } from "../shared/constants/socket.constant.js";
import { userDisconnected } from "./socket-events/user.event.js";
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

    socket.on('disconnect', (reason, callback) => userDisconnected(io, socket, reason, callback));

  });
}

export default registerSocketRoute;
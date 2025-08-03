import { socketMiddleware } from "../middlewares/socket.middleware.js";
import { CHAT_ACTION } from "../shared/constants/socket.constant.js";
import { channelHandler } from "./socket-handlers/channel.handler.js";
import { chatHandler } from "./socket-handlers/chat.handler.js";
import { groupHandler } from "./socket-handlers/group.handler.js";

const registerSocketRoute = (io) => {
  io.use(socketMiddleware).on('connection', (socket) => {
    console.log(`User : ${socket.id} has join the socket`);

    // Update user Online status
    socket.user.status = true;

    // TRY TO CHECK JOIN ROOM
    groupHandler(io, socket);
    channelHandler(io, socket);

    chatHandler(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`Socket id : ${socket.id} has disconnected reason : ${reason}`);

      // Update user Offline status
      socket.user.status = false;

      // Handle tell user has left the chatRoom
      socket.to('ROOMID').emit(CHAT_ACTION.LEAVE_CHAT, {
        message: `${socket.user.name} has left the group`,
        userId: socket.user.name,
      });

    });

  });
}

export default registerSocketRoute;
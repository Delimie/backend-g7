import { socketMiddleware } from "../middlewares/socket.middleware.js";
import { CHANNEL_ACTION, CHAT_ACTION, GROUP_ACTION } from "../shared/constants/socket.constant.js";
import { chatHandler } from "./socket-handlers/chat.handler.js";

const registerSocketRoute = (io) => {
  io.use(socketMiddleware).on('connection', (socket) => {
    console.log(`User : ${socket.id} has join the socket`);

    // Update user Online status
    socket.user.status = true;

    // TRY TO CHECK JOIN ROOM
    socket.on(GROUP_ACTION.GROUP_JOIN, ({ groupId }) => {
      socket.join(`GROUP:${groupId}`);
      console.log(socket.user.name,' has join group ',groupId);
    });
    socket.on(CHANNEL_ACTION.CHANNEL_JOIN,({channelId})=>{
      socket.join(`CHANNEL:${channelId}`);    
      console.log(socket.user.name,' has join channel ',channelId);
    });
    
    socket.on(CHANNEL_ACTION.CHANNEL_LEAVE, ({channelId})=>{
      socket.leave(`CHANNEL:${channelId}`); 
      console.log(socket.user.name,' has leave channel ',channelId);
    })

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
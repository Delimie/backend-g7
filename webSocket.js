import { socketMiddleware } from "./src/middlewares/socket.middleware.js";
import { CHAT_ACTION } from "./src/shared/constants/socket.constant.js";

const registerSocketRoute = (io) => {
  io.use(socketMiddleware).on('connection', (socket) => {
    console.log(`User : ${socket.id} has join the socket`);

    // Update user Online status
    socket.user.status = true;


    socket.on('disconnect', (reason) => {
      console.log(`Socket id : ${socket.id} has disconnected reason : ${reason}`);

      // Update user Offline status
      socket.user.status = false;



      // Handle tell user has left the chatRoom
      socket.to('ROOMID').emit(CHAT_ACTION.LEAVE_CHAT, {
        message: `${socket.user.name} has left the group`,
        useruserId: socket.user.name,
      });

    });


  });
}

export default registerSocketRoute;
import { CHAT_ACTION, STATUS } from "../../shared/constants/socket.constant.js";

export const userTyping = (io, socket, data, callback) => {
  // Listen to user typing status
    if (!data) return;

    const { status } = data;
    if (status === STATUS.ACTIVE) {
      // console.log(`User : ${socket.user.name} is typing`);

      socket.to('CHANNEL:ID').emit(CHAT_ACTION.CHAT_TYPING, {
        userName: socket.user.name,
        status: status
      });
    }

    // console.log(`User : ${socket.user.name} is not typing`);
    socket.to('CHANNEL:ID').emit(CHAT_ACTION.CHAT_TYPING, {
      userName: socket.user.name,
      status: status
    });
};
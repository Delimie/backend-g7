import { CHAT_ACTION, STATUS } from "../../shared/constants/socket.constant.js";

export const userTyping = (io, socket, data, callback) => {
  // Listen to user typing status
    if (!data) return;

    const { status } = data;
    if (status === STATUS.ACTIVE) {
      // console.log(`User : ${socket.user.name} is typing`);

<<<<<<< HEAD
      socket.to('CHANNELID').emit(CHAT_ACTION.CHAT_TYPING, {
=======
      socket.to('ROOMID').emit(CHAT_ACTION.CHAT_TYPING, {
>>>>>>> 6962f8e3f0e60d824d2e0331dfc97911bfe799ab
        userName: socket.user.name,
        status: status
      });
    }

    // console.log(`User : ${socket.user.name} is not typing`);
<<<<<<< HEAD
    socket.to('CHANNELID').emit(CHAT_ACTION.CHAT_TYPING, {
=======
    socket.to('ROOMID').emit(CHAT_ACTION.CHAT_TYPING, {
>>>>>>> 6962f8e3f0e60d824d2e0331dfc97911bfe799ab
      userName: socket.user.name,
      status: status
    });
};
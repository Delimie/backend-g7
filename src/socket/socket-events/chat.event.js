import { CHAT_ACTION, STATUS } from "../../shared/constants/socket.constant.js";

export const userTyping = (io, socket, data, callback) => {
  // Listen to user typing status
    if (!data) return;

    const { status } = data;
    if (status === STATUS.ACTIVE) {
      // console.log(`User : ${socket.user.name} is typing`);

<<<<<<< HEAD
<<<<<<< HEAD
      socket.to('CHANNELID').emit(CHAT_ACTION.CHAT_TYPING, {
=======
      socket.to('ROOMID').emit(CHAT_ACTION.CHAT_TYPING, {
>>>>>>> 07338de (add socket.on uesrtyping event, refactor socket folder structure separate handlers and event)
=======
      socket.to('ROOMID').emit(CHAT_ACTION.CHAT_TYPING, {
>>>>>>> 4670d99 (add socket.on uesrtyping event, refactor socket folder structure separate handlers and event)
        userName: socket.user.name,
        status: status
      });
    }

    // console.log(`User : ${socket.user.name} is not typing`);
<<<<<<< HEAD
<<<<<<< HEAD
    socket.to('CHANNELID').emit(CHAT_ACTION.CHAT_TYPING, {
=======
    socket.to('ROOMID').emit(CHAT_ACTION.CHAT_TYPING, {
>>>>>>> 07338de (add socket.on uesrtyping event, refactor socket folder structure separate handlers and event)
=======
    socket.to('ROOMID').emit(CHAT_ACTION.CHAT_TYPING, {
>>>>>>> 4670d99 (add socket.on uesrtyping event, refactor socket folder structure separate handlers and event)
      userName: socket.user.name,
      status: status
    });
};
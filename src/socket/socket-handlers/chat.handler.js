import prisma from "../../config/prisma.config.js";
import { CHAT_ACTION, CHAT_EVENT, NOTI_ACTION, STATUS } from "../../shared/constants/socket.constant.js";
import { userDeleteMessage, userEditMessage, userSendMessage, userTyping } from "../socket-events/chat.event.js";

export const chatHandler = (io, socket) => {
  
  // Listen to user typing status
  socket.on(CHAT_ACTION.CHAT_TYPING, (data, callback) => userTyping(io, socket, data, callback));

  // Listen to user sending message and if attached file with it
  socket.on(CHAT_ACTION.CHAT_SEND, (data, callback) => userSendMessage(io, socket, data, callback));

  // Listen to user delete message
  socket.on(CHAT_ACTION.CHAT_DELETE, (data, callback) => userDeleteMessage(io, socket, data, callback));
  
  // Listen to user editing message
  socket.on(CHAT_ACTION.CHAT_EDIT, (data, callback) => userEditMessage(io, socket, data, callback));

};
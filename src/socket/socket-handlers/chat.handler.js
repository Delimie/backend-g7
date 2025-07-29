import prisma from "../../config/prisma.config.js";
import { CHAT_ACTION, CHAT_EVENT, NOTI_ACTION, STATUS } from "../../shared/constants/socket.constant.js";
import { userSendMessage, userTyping } from "../socket-events/chat.event.js";

export const chatHandler = (io, socket) => {

  // Listen to user typing status
  socket.on(CHAT_ACTION.CHAT_TYPING, (data) => userTyping(io, socket, data));

  // Listen to user sending message and if attached file with it
  socket.on(CHAT_ACTION.CHAT_SEND, (data) => userSendMessage(io, socket, data));

};
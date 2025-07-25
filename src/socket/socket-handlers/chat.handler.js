import { CHAT_ACTION, STATUS } from "../../shared/constants/socket.constant.js";
import { userTyping } from "../socket-events/chat.event.js";

export const chatHandler = (io, socket) => {

  // Listen to user typing status
  socket.on(CHAT_ACTION.CHAT_TYPING, (data) => userTyping(io,socket,data));
  
};
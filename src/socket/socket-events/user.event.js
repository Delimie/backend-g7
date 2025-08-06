import prisma from "../../config/prisma.config.js";
import { CHAT_ACTION, GROUP_ACTION } from "../../shared/constants/socket.constant.js";

export const userDisconnected = async (io, socket, data, callback) => {
  console.log(`Socket id : ${socket.id} has disconnected reason : ${data}`);

  // Update user Offline status
  socket.user.status = false;
  socket.user.onlineStatus = "OFFLINE";
  await prisma.user.update({ where: { id: socket.user.id }, data: { onlineStatus: "OFFLINE" } });

  // Handle tell server that User leave
  if (socket.user.onlineStatus === "OFFLINE") socket.broadcast.emit(GROUP_ACTION.GROUP_LEAVE, { message: `User ${socket.user.name} has disconnected`, user: socket.user });

  // Handle tell user has left the chatRoom
  socket.to('ROOMID').emit(CHAT_ACTION.LEAVE_CHAT, {
    message: `${socket.user.name} has left the group`,
    userId: socket.user.name,
  });

}
import prisma from "../../config/prisma.config.js";
import { CHAT_ACTION, CHAT_EVENT, NOTI_ACTION, STATUS } from "../../shared/constants/socket.constant.js";
import { userTyping } from "../socket-events/chat.event.js";

export const chatHandler = (io, socket) => {

  // Listen to user typing status
  socket.on(CHAT_ACTION.CHAT_TYPING, (data) => userTyping(io, socket, data));

  // Listen to user sending message and if attached file with it
  socket.on(CHAT_ACTION.CHAT_SEND, async (data, callback) => {
    const { content = null, userId, channelId, file = null, ...restData } = data

    // Check if client don't send both file
    if (!(content || file)) return callback({ success: false, message: 'Should send file or message' });

    const { url = null, type = null, name = null, size = null } = file;
    let attachResponse;

    console.log(`User : ${userId}, has send a message ${file ? 'with attached file' : ''}`);

    // Create message in database
    const messageResponse = await prisma.message.create({
      data: {
        userId: userId,
        content: content,
        channelId: channelId,
      }
    });

    // If file are attached, update database
    if (file) {
      attachResponse = await prisma.attachment.create({
        data: {
          messageId: messageResponse.id,
          url: url,
          type: type,
          name: name,
          size: size
        }
      });
    }

    socket.to(`CHANNEL:${channelId}`).emit(CHAT_EVENT.SYNC_MESSAGE, {});

    socket.to('GROUP:ID').emit(NOTI_ACTION.NOTI_UPDATE, { channel: channelId, userId: userId, updateAt: Date.now() });
  });


};
import { CHAT_ACTION, STATUS } from "../../shared/constants/socket.constant.js";

export const userTyping = (io, socket, data, callback) => {
  // Listen to user typing status
  if (!data) return;

  const { status } = data;
  if (status === STATUS.ACTIVE) {
    // console.log(`User : ${socket.user.name} is typing`);

    // Actual emit that has to happen
    socket.to('CHANNEL:ID').emit(CHAT_ACTION.CHAT_TYPING, {
      userName: socket.user.name,
      status: status
    });

    // For testing user is typing notification
    socket.emit(CHAT_ACTION.CHAT_TYPING, {
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

export const userSendMessage =async (io, socket, data, callback) => {
  const { content = null, userId, channelId, groupId, file = null, ...restData } = data

  // Check if client don't send content or file
  if (!(content || file)) return socket.emit(CHAT_EVENT.CHAT_ERROR, { message: 'Message or File is missing' });

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

  socket.to(`GROUP:${groupId}`).emit(NOTI_ACTION.NOTI_UPDATE, { channel: channelId, userId: userId, updateAt: Date.now() });
};


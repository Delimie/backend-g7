import prisma from "../../config/prisma.config.js";
import { CHAT_ACTION, isValidCallback, STATUS } from "../../shared/constants/socket.constant.js";

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

export const userSendMessage = async (io, socket, data, callback) => {
  try {

    const { content = null, userId, channelId, groupId, file = null, ...restData } = data

    // Check if client don't send content or file
    if (!(content || file)) return socket.emit(CHAT_EVENT.CHAT_ERROR, { message: 'Message Content or File is missing' });

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

    socket.to(`CHANNEL:${channelId}`).emit(CHAT_ACTION.CHAT_SEND, {
      message: messageResponse,
      attachment: attachResponse ? attachResponse : null,
    });

    socket.to(`GROUP:${groupId}`).emit(NOTI_ACTION.NOTI_UPDATE, { channel: channelId, userId: userId, updateAt: Date.now() });

    if (isValidCallback(callback)) callback({ success: true, message: messageResponse });

  } catch (error) {
    console.error('Error in userSendMessage:', error);
    socket.emit(CHAT_EVENT.CHAT_ERROR, { message: 'Failed to send message', error: error.message });

    // Optional: callback with error
    if (isValidCallback(callback)) callback({ success: false, error: error.message });
  }
};

export const userDeleteMessage = async (io, socket, data, callback) => {
  try {

    const { id, channelId, groupId } = data

    console.log(`User ${socket.user.name} is delete message id : ${id}`);

    const deleteResponse = await prisma.message.delete({ where: { id: id } });

    console.log('prisma deleted :', deleteResponse)

    socket.to(`CHANNEL:${channelId}`).emit(CHAT_ACTION.CHAT_DELETE, {
      message: `User ${socket.user.name} deleted the message ${deleteResponse.id}`,
      id: deleteResponse.id,
    });

    socket.to(`GROUP:${groupId}`).emit(NOTI_ACTION.NOTI_UPDATE, { channel: channelId, userId: userId, updateAt: Date.now() });

    if (isValidCallback(callback)) callback({ success: true, message: 'Delete successful' });

  } catch (error) {
    console.error('Error in userDeletedMessage:', error);
    socket.emit(CHAT_EVENT.CHAT_ERROR, { message: 'Failed to deleted message', error: error.message });

    // Optional: callback with error
    if (isValidCallback(callback)) callback({ success: false, error: error.message });
  }
};


export const userEditMessage = async (io, socket, data, callback) => {
  try {
    const { id, content, channelId, groupId } = data

    console.log(`User ${socket.user.name} is edited message id : ${id}`);

    const response = await prisma.message.update({
      where: { id: id },
      data: { content: content }
    });

    console.log('prisma edited :', response)

    socket.to(`CHANNEL:${response.channelId}`).emit(CHAT_ACTION.CHAT_EDIT, {
      message: `User ${socket.user.name} edited the message ${response.id}`,
      newData : response,
    });

    socket.to(`GROUP:${groupId}`).emit(NOTI_ACTION.NOTI_UPDATE, { channel: channelId, userId: userId, updateAt: Date.now() });

    if (isValidCallback(callback)) callback({ success: true, message: 'Edited successful' });

  } catch (error) {
    console.error('Error in userEditMessage:', error);
    socket.emit(CHAT_EVENT.CHAT_ERROR, { message: 'Failed to edit message', error: error.message });

    // Optional: callback with error
    if (isValidCallback(callback)) callback({ success: false, error: error.message });
  }
};


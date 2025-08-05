import * as chatService from "../services/chat.service.js";
import createError from "../utils/create-error.js";

export const getChatsByChannelId = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const {channelId} = req.params;
    if (!userId) createError(400, "Unauthorized: userId missing")
    if(!channelId) createError(400, "Missing ChannelId")

    const chats = await chatService.getChatByChannelId(Number(channelId));
    // console.log('chats found:', groups)
    res.json({ message: 'Get all chats succesful', result: chats });
  } catch (error) {
    next(error);
  }
};
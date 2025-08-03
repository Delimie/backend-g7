import prisma from "../config/prisma.config.js";
import createError from '../utils/create-error.js';

export const getChatByChannelId = async (channelId) => {
    const response = await prisma.message.findMany({ where: { channelId: Number(channelId) } });
    return response;
}
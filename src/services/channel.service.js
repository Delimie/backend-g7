import prisma from "../config/prisma.config.js";
import createError from '../utils/create-error.js';

export const createChannel = async (data) => {
  const { name, type = 'TEXT', groupId } = data

  if (!name) createError(400, 'Channel name is required');
  if (!groupId) createError(400, 'Group ID is required');

  const existingGroup = await prisma.channel.findUnique({ where: { id: groupId } })
  if (!existingGroup) createError(404, 'Group not found')

  const channel = await prisma.channel.create({
    data: {
      name,
      type,
      groupId: groupId,
    },
  })
  return channel
};

export const getChannelByGroupId = (groupId) => {
  return prisma.channel.findMany({ where: { groupId: groupId } });
};

export const getChannelById = (channelId) => {
  return prisma.channel.findUnique({ where: { id: channelId } });
};

export const updateChannelName = (id, newName) => {
  return prisma.channel.update({
    where: { id },
    data: {
      name: newName,
    },
  })
};

export const deleteChannel = (id) => {
  return prisma.channel.delete({ where: { id } })
}
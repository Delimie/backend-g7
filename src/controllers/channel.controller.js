import * as channelService from "../services/channel.service.js";
import createError from "../utils/create-error.js";

export const createNewChannel = async (req, res, next) => {
  try {
    const { name, type, groupId } = req.body;

    // Create channel with desired name 
    const channel = await channelService.createChannel({ name: name, type, groupId: groupId });

    res.status(201).json({ message: 'Channel created', result: channel })
  } catch (err) {
    next(err)
  }
}

export const getChannelByGroupId = async (req, res, next) => {
  try {
    const groupId = Number(req.params.id)
    const channels = await channelService.getChannelByGroupId(groupId)

    if (!channels) {
      createError(404, 'Channel not found')
    }

    res.json({ message: 'Successfuly get Channel', result: channels });
  } catch (err) {
    next(err)
  }
}

export const updateChannel = async (req, res, next) => {
  try {
    const channelId = Number(req.params.id)
    const { name } = req.body

    const existingChannel = await channelService.getChannelById(channelId)
    if (!existingChannel) {
      createError(404, 'Channel not found')
    }

    const updatedChannel = await channelService.updateChannelName(channelId, name);

    res.json({ message: 'Successfuly get update Channel', result: updatedChannel })
  } catch (err) {
    next(err)
  }
};

export const deleteChannel = async (req, res, next) => {
  try {
    const channelId = Number(req.params.id)

    const existingChannel = await channelService.getChannelById(channelId)
    if (!existingChannel) {
      createError(404, 'Channel not found')
    }

    const result = await channelService.deleteChannel(channelId)
    res.json({ message: 'Channel deleted successfully', result })
  } catch (err) {
    next(err)
  }
}


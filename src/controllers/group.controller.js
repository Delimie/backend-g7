import * as groupService from '../services/group.service.js'
import createError from "../utils/create-error.js";
import * as userService from '../services/user.service.js'
import {
  createChannel
} from '../services/channel.service.js';

export const createGroup = async (req, res, next) => {
  try {
    const { name } = req.body
    const ownerId = req.user?.id
    const group = await groupService.createGroup({ name, ownerId });

    // Create starter TEXT channel 
    const defaultChannel = await createChannel({ name: `Welcome to group : ${name}`, groupId: group.id });

    res.status(201).json({ message: 'Group created', group , channel : defaultChannel})
  } catch (err) {
    next(err)
  }
}

export const getGroupById = async (req, res, next) => {
  try {
    const groupId = Number(req.params.id)
    const group = await groupService.getGroupById(groupId)

    if (!group) {
      createError(404, 'Group not found')
    }

    res.json(group)
  } catch (err) {
    next(err)
  }
}

export const updateGroup = async (req, res, next) => {
  try {
    const groupId = Number(req.params.id)
    const { name } = req.body

    const existingGroup = await groupService.getGroupById(groupId)
    if (!existingGroup) {
      createError(404, 'Group not found')
    }

    const updatedGroup = await groupService.updateGroup(groupId, {
      name,
    })

    res.json(updatedGroup)
  } catch (err) {
    next(err)
  }
}

export const deleteGroup = async (req, res, next) => {
  try {
    const groupId = Number(req.params.id)

    const existingGroup = await groupService.getGroupById(groupId)
    if (!existingGroup) {
      createError(404, 'Group not found')
    }

    const result = await groupService.deleteGroup(groupId)
    res.json({ message: 'Group deleted successfully', result })
  } catch (err) {
    next(err)
  }
}

export const addUserToGroup = async (req, res, next) => {
  try {
    const groupId = Number(req.params.id)
    const userId = req.body.userId
    const role = req.body.role || 'USER'

    const group = await groupService.getGroupById(groupId)
    if (!group) {
      createError(404, 'Group not found')
    }

    const user = await userService.getUserById(userId)
    if (!user) {
      createError(404, 'User not found')
    }

    const existingMember = await groupService.findGroupUser(groupId, userId)
    if (existingMember) {
      createError(400, 'User already in group')
    }

    const result = await groupService.addUserToGroup(groupId, userId, role)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const removeUserFromGroup = async (req, res, next) => {
  try {
    const { id: groupId, userId } = req.params

    const group = await groupService.getGroupById(Number(groupId))
    if (!group) {
      createError(404, 'Group not found')
    }

    const groupUser = await groupService.findGroupUser(Number(groupId), Number(userId))
    if (!groupUser) {
      createError(404, 'User is not a member of this group')
    }

    const result = await groupService.removeUserFromGroup(Number(groupId), Number(userId))
    res.json({ message: `Removed user ${userId} from group ${groupId}` })
  } catch (err) {
    next(err)
  }
}

export const getUsersInGroup = async (req, res) => {
  const groupId = Number(req.params.id)
  const users = await groupService.getUsersInGroup(groupId)
  res.json({ message: users })
}

export const getGroupSummary = async (req, res) => {
  const groupId = Number(req.params.groupId)
  const summary = await groupService.getGroupSummary(groupId)
  res.json(summary)
}

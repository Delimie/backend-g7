import * as groupService from '../services/group.service.js'
import createError from "../utils/create-error.js";

export const createGroup = async (req, res, next) => {
  try {
    const { name } = req.body

    const existingGroup = await groupService.findGroupByName(name)
    if (existingGroup) {
      throw createError(400, 'Group name already exists')
    }

    const group = await groupService.createGroup({ name })
    res.status(201).json(group)
  } catch (err) {
    next(err)
  }
}

export const getGroupById = async (req, res) => {
  const group = await groupService.getGroupById(Number(req.params.id))
  res.json(group)
}

export const updateGroup = async (req, res) => {
  const group = await groupService.updateGroup(Number(req.params.id), req.body)
  res.json(group)
}

export const deleteGroup = async (req, res) => {
  const result = await groupService.deleteGroup(Number(req.params.id))
  res.json(result)
}

export const addUserToGroup = async (req, res) => {
  const groupId = Number(req.params.id)
  const userId = req.body.userId
  const role = req.body.role || 'USER'
  const result = await groupService.addUserToGroup(groupId, userId, role)
  res.json(result)
}

export const removeUserFromGroup = async (req, res) => {
  const { id: groupId, userId } = req.params
  const result = await groupService.removeUserFromGroup(Number(groupId), Number(userId))
  res.json(result)
}

export const getUsersInGroup = async (req, res) => {
  const groupId = Number(req.params.id)
  const users = await groupService.getUsersInGroup(groupId)
  res.json(users)
}

export const getGroupSummary = async (req, res) => {
  const groupId = Number(req.params.groupId)
  const summary = await groupService.getGroupSummary(groupId)
  res.json(summary)
}

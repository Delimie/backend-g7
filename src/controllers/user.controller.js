import * as userService from '../services/user.service.js'

export const getMe = async (req, res, next) => {
  try {
    const result = await userService.getMe(req.user.id)
    res.json({ result })
  } catch (error) {
    next(error)
  }
}

export const listUser = async (req, res, next) => {
  try {
    const result = await userService.listUser()
    res.json({ result })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await userService.updateUser(Number(id), req.body)
    res.json({ message: 'Update successfully', result })
  } catch (error) {
    next(error)
  }
}

export const removeUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await userService.removeUser(Number(id))
    res.json({ message: `Delete ${result.name} success` })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await userService.getUserById(Number(id))
    res.json({ result })
  } catch (error) {
    next(error)
  }
}

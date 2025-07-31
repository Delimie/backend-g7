import * as userService from '../services/user.service.js'

export const getMe = async (req, res, next) => {
  try {

    // console.log('req.user in getMe:', req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

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
    const result = await userService.updateUser(Number(id), req.body, req.files)
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

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("userId =>", userId)
    const { currentPassword, newPassword } = req.body;
    await userService.handleChangePassword(userId, currentPassword, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
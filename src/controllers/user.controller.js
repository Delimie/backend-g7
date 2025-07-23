import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

export const getMe = async (req, res, next) => {
  try {
    const { id } = req.user
    console.log(id)
    const user = await prisma.user.findFirst({
      where: { id: Number(id) },
      omit: { password: true }
    })
    res.json({ result: user })
  } catch (error) {
    next(error)
  }
}

export const listUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
        profileImage: true,
        coverImage: true
      }
    })
    res.json({ result: user })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, mobile, birthDate, occupation, address, profileImage, coverImage } = req.body
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: name,
        mobile: mobile,
        birthDate: new Date(birthDate),
        occupation: occupation,
        address: address,
        profileImage: profileImage,
        coverImage: coverImage
      }
    })
    res.json({ message: 'Update successfully', result: user })
  } catch (error) {
    next(error)
  }
}

export const removeUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.delete({
      where: { id: Number(id) }
    })
    res.json({ message: `Delete ${user.name} success` })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findFirst({
      where: { id: Number(id) },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
        profileImage: true,
        coverImage: true
      }
    })
    res.json({ result: user })
  } catch (error) {
    next(error)
  }
}
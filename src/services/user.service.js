import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.js'

export const getMe = async (id) => {
  if (!id) createError(404, 'User ID is required')
  return await prisma.user.findFirst({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      birthDate: true,
      occupation: true,
      address: true
    }
  })
}

export const listUser = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      birthDate: true,
      occupation: true,
      address: true
    }
  })
}

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      mobile: data.mobile,
      birthDate: new Date(data.birthDate),
      occupation: data.occupation,
      address: data.address,
      profileImage: data.profileImage,
      coverImage: data.coverImage
    }
  })
}

export const removeUser = async (id) => {
  return await prisma.user.delete({
    where: { id }
  })
}

export const getUserById = async (id) => {
  return await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      birthDate: true,
      occupation: true,
      address: true
    }
  })
}


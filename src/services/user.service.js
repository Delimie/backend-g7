import bcrypt from 'bcryptjs'
import cloudinary from '../config/cloudinary.config.js'
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
      gender: true,
      occupation: true,
      address: true,
      profileImage: true,
      qrCode: true
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
      gender: true,
      occupation: true,
      address: true,
      profileImage: true,
      qrCode: true
    }
  })
}

export const updateUser = async (id, data, files) => {
  const updatedData = {}
  const fields = ['name', 'mobile', 'birthDate', 'gender', 'occupation', 'address']

  fields.forEach(key => {
    if (data[key]) updatedData[key] = data[key]
  })

  if (data.birthDate) {
    const date = new Date(data.birthDate)
    if (!isNaN(date)) updatedData.birthDate = date
  }

  if (files?.profileImage?.[0]) {
    const upload = await cloudinary.uploader.upload(files.profileImage[0].path)
    updatedData.profileImage = upload.secure_url
  }

  if (files?.qrCode?.[0]) {
    const upload = await cloudinary.uploader.upload(files.qrCode[0].path)
    updatedData.qrCode = upload.secure_url
  }

  return await prisma.user.update({
    where: { id },
    data: updatedData
  })
}

export const removeUser = async (id) => {
  return await prisma.user.delete({
    where: { id }
  })
}

export const getUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: { id: Number(id) }
  })
  if (!user) createError(400, 'User not found')
  return await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      birthDate: true,
      occupation: true,
      gender: true,
      address: true
    }
  })
}

export const handleChangePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findFirst({
    where: { id: Number(userId) },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw createError(400, "Password is incorrect");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashed },
  });
};
import prisma from '../config/prisma.config.js'

export const findGroupByName = async (name) => {
  const lowerName = name.toLowerCase()
  return await prisma.group.findFirst({
    where: {
      name: {
        contains: lowerName,
      }
    }
  })
}

export const createGroup = (data) => {
  return prisma.group.create({
    data,
  })
}

export const getGroupById = (id) => {
  return prisma.group.findUnique({ where: { id } })
}

export const updateGroup = (id, data) => {
  return prisma.group.update({
    where: { id },
    data,
  })
}

export const deleteGroup = (id) => {
  return prisma.group.delete({ where: { id } })
}

export const addUserToGroup = (groupId, userId, role = 'USER') => {
  return prisma.groupUser.create({
    data: {
      groupId,
      userId,
      role,
    },
  })
}

export const removeUserFromGroup = (groupId, userId) => {
  return prisma.groupUser.deleteMany({
    where: {
      groupId,
      userId,
    },
  })
}

export const getUsersInGroup = (groupId) => {
  return prisma.groupUser.findMany({
    where: { groupId },
    include: {
      user: true,
    },
  })
}

export const getGroupSummary = async (groupId) => {
  const users = await prisma.groupUser.findMany({
    where: { groupId },
    include: {
      user: true,
      expense: true,
    },
  })

  return {
    groupId,
    totalMembers: users.length,
    members: users.map((gu) => ({
      id: gu.user.id,
      name: gu.user.name,
      totalExpenses: gu.expense.reduce((sum, e) => sum + e.amount, 0),
    })),
  }
}

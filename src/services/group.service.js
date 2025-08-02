import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.js'

export const createGroup = async ({ name, ownerId }) => {

  if (!name) createError(400, 'Group name is required')
  if (!ownerId) createError(400, 'Owner ID is required')

  const user = await prisma.user.findUnique({ where: { id: ownerId } })
  if (!user) createError(404, 'User not found')

  const group = await prisma.group.create({
    data: {
      name,
      user: {
        create: {
          userId: ownerId,
          role: 'ADMIN'
        }
      }
    },
    include: {
      user: {
        include: {
          user: {
            select: {
              // id: true,
              name: true,
              profileImage: true
            }
          }
        }
      }
    }
  })
  return group
}

export const getGroupById = (id) => {
  const groupId = Number(id)
  if (!groupId || isNaN(groupId)) {
    createError(400, 'Invalid group ID')
  }
  return prisma.group.findUnique({ where: { id: groupId } })
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

export const findGroupUser = async (groupId, userId) => {
  return await prisma.groupUser.findFirst({
    where: {
      groupId,
      userId,
    },
  })
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

export const getUsersInGroup = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId }
  })

  if (!group) createError(404, 'Group not found')

  const members = await prisma.groupUser.findMany({
    where: { groupId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true
        }
      }
    }
  })

  const users = members.map(m => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    profileImage: m.user.profileImage,
    role: m.role
  }))

  return {
    groupId: group.id,
    groupName: group.name,
    members: users
  }
}

export const getGroupSummary = async (groupId) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      id: true,
      name: true,
      createdAt: true
    }
  })

  if (!group) createError(404, 'Group not found')

  const memberCount = await prisma.groupUser.count({
    where: { groupId }
  })

  const expenseCount = await prisma.expense.count({
    where: {
      groupUser: {
        groupId
      }
    }
  })

  const appointmentCount = await prisma.groupUserAppointment.count({
    where: {
      groupUser: {
        groupId
      }
    }
  })

  const totalExpense = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: {
      groupUser: {
        groupId
      }
    }
  })

  return {
    groupId: group.id,
    groupName: group.name,
    memberCount,
    expenseCount,
    appointmentCount,
    totalExpense: totalExpense._sum.amount || 0
  }
}

export const findGroupsByUserId = async (userId) => {
  const groupUsers = await prisma.groupUser.findMany({
    where: { userId: Number(userId) },
    include: { group: true },
  });

  return groupUsers.map((gu) => gu.group);
};

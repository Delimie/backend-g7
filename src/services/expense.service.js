import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.js'

export const createExpense = async (data) => {
  const {
    title,
    amount,
    receiptImage,
    groupId,
    userId,
    date,
  } = data

  const group = await prisma.group.findUnique({ where: { id: groupId } })
  if (!group) {
    createError(404, 'Group not found')
  }

  const groupUser = await prisma.groupUser.findFirst({
    where: { groupId, userId }
  })
  if (!groupUser) {
    createError(404, 'User is not a member of the group')
  }

  const expense = await prisma.expense.create({
    data: {
    title,
    amount,
    receiptImage,
    date: date ? new Date(date) : new Date(),
    groupUserId: groupUser.id
  },
    include: {
      groupUser: {
        include: {
          user: {
            select: { id: true, name: true }
          },
          group: {
            select: { id: true, name: true }
          }
        }
      }
    }
  })

  return expense
}

export const getExpenseById = async (id) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      groupUser: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            }
          },
          group: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      expenseSplit: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            }
          },
          debtTransaction: true,
        }
      }
    }
  })

  if (!expense) {
    createError(404, 'Expense not found')

  }

  return expense
}

export const updateExpense = async (id, data) => {

  const existingExpense = await prisma.expense.findUnique({
    where: { id }
  })

  if (!existingExpense) {
    createError(404, 'Expense not found')
  }

  const updatedExpense = await prisma.expense.update({
    where: { id },
    data,
    include: {
      groupUser: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            }
          },
          group: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      expenseSplit: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            }
          },
          debtTransaction: true,
        }
      }
    }
  })

  return updatedExpense
}

export const deleteExpense = async (id) => {
  const existingExpense = await prisma.expense.findUnique({
    where: { id }
  })

  if (!existingExpense) {
    createError(404, 'Expense not found')
  }

  const deletedExpense = await prisma.expense.delete({
    where: { id }
  })

  return { message: 'Expense deleted successfully', deletedExpense }
}

export const getExpensesByGroupId = async (groupId) => {

  if (!groupId || isNaN(groupId)) {
    createError(404, 'Invalid group ID')
  }
  const expenses = await prisma.expense.findMany({
    where: {
      groupUser: {
        groupId: groupId
      }
    },
    include: {
      groupUser: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true
            }
          },
          group: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      expenseSplit: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          },
          debtTransaction: true
        }
      }
    }
  })

  return expenses
}

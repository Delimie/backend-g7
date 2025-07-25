import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.js'

export const listExpenseSplits = async () => {
  return await prisma.expenseSplit.findMany()
}

export const createExpenseSplits = async (expenseId, data) => {
  const { amount, status, userId } = data

  const user = await prisma.user.findFirst({ where: { id: Number(userId) } })
  if (!user) throw createError(400, 'Not found user')

  const expense = await prisma.expense.findFirst({ where: { id: expenseId } })
  if (!expense) throw createError(400, 'Not found expense')

  return await prisma.expenseSplit.create({
    data: {
      userId: Number(userId),
      amount: Number(amount),
      status,
      expenseId
    }
  })
}

export const updateExpenseSplit = async (splitId, expenseId, data) => {
  const { amount } = data

  const expense = await prisma.expense.findFirst({ where: { id: expenseId } })
  if (!expense) throw createError(400, 'Not found expense')

  return await prisma.expenseSplit.update({
    where: { id: splitId },
    data: { amount: Number(amount) }
  })
}

export const removeExpenseSplit = async (splitId) => {
  return await prisma.expenseSplit.delete({
    where: { id: splitId }
  })
}

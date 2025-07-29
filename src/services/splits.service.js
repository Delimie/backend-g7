import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.js'

export const listExpenseSplits = async () => {
  return await prisma.expenseSplit.findMany()
}

export const createExpenseSplits = async (expenseId, data) => {
  const { amount, status, userId } = data
  // console.log("data", data)
  // console.log("expenseId", expenseId)
  // const numericExpenseId = Number(expenseId)
  // console.log("numericExpenseId", numericExpenseId)
  // if (isNaN(numericExpenseId)) createError(400, 'Invalid expenseId')

  const user = await prisma.user.findFirst({ where: { id: Number(userId) } })
  // console.log("user => ", user)
  // console.log("userId => ", userId)
  if (!user) throw createError(400, 'Not found user id')

  const expense = await prisma.expense.findFirst({ where: { id: Number(expenseId) } })
  if (!expense) throw createError(400, 'Not found expense id')

  return await prisma.expenseSplit.create({
    data: {
      userId: Number(userId),
      amount: Number(amount),
      status: status || "UNPAID",
      expenseId: Number(expenseId)
    }
  })
}

export const updateExpenseSplit = async (splitId, data) => {
  const { amount } = data
  // console.log('expenseId =>', expenseId)
  // const expense = await prisma.expense.findUnique({ where: { id: Number(expenseId) } })
  // if (!expense) throw createError(400, 'Not found expense')

  return await prisma.expenseSplit.update({
    where: { id: Number(splitId) },
    data: { amount: Number(amount) }
  })
}

export const removeExpenseSplit = async (splitId) => {
  return await prisma.expenseSplit.delete({
    where: { id: splitId }
  })
}

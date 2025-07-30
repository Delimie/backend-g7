import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.js'

export const listExpenseSplits = async (expenseId) => {
  return await prisma.expenseSplit.findMany({
    where: { expenseId: Number(expenseId) }
  })
}

export const createExpenseSplits = async (expenseId, data, ownerId) => {
  const { amount, status, userId } = data
  // console.log("data", data)
  // console.log("expenseId", expenseId)
  // const numericExpenseId = Number(expenseId)
  // console.log("numericExpenseId", numericExpenseId)
  // if (isNaN(numericExpenseId)) createError(400, 'Invalid expenseId')

  const user = await prisma.user.findFirst({ where: { id: Number(userId) } })
  // console.log("user => ", user)
  // console.log("userId => ", userId)
  if (ownerId === userId) createError(400, 'You are owner of this expense !')
  if (!user) createError(400, 'Not found user id')

  const expense = await prisma.expense.findFirst({ where: { id: Number(expenseId) } })
  if (!expense) createError(400, 'Not found expense id')

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

export const removeExpenseSplit = async (expenseId, splitId) => {
  const expense = await prisma.expense.findFirst({
    where: { id: Number(expenseId) }
  })
  if (!expense) createError(400, 'Expense not found')

  const split = await prisma.expenseSplit.findFirst({
    where: { id: Number(splitId) }
  })
  if (!split) createError(400, 'Expense split not found')

  return await prisma.expenseSplit.delete({
    where: { id: splitId }
  })
}

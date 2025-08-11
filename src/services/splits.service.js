import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.js'

export const listExpenseSplits = async (expenseId) => {

  const expense = await prisma.expense.findFirst({ where: { id: Number(expenseId) } })
  if (!expense) createError(400, 'Not found expense id')

  return await prisma.expenseSplit.findMany({
    where: { expenseId: Number(expenseId) },
    include: {
      user: true,               // เพื่อดึงข้อมูล user ด้วย
      debtTransaction: true,    // เพื่อดึงข้อมูล debtTransaction ด้วย
    }
  })
}

export const createExpenseSplits = async (expenseId, data, ownerId) => {
  const { amount, status, userId } = data

  const user = await prisma.user.findFirst({ where: { id: Number(userId) } })
  if (ownerId === userId) createError(400, 'You are owner of this expense !')
  if (!user) createError(400, 'Not found user id')

  const expense = await prisma.expense.findFirst({ where: { id: Number(expenseId) } })
  if (!expense) createError(400, 'Not found expense id')

  // ถ้าอยากตรวจสอบหนี้ที่หักลบกันเรียบร้อยแล้ว เช่น
  // เช็คว่าคนนี้คือ payer หรือถูกหักลบหมดแล้ว จะตั้ง status = "PAID"
  // ตัวอย่างสมมติ: 
  // (คุณอาจต้องเขียนฟังก์ชันเช็คสถานะตาม logic หนี้ที่คุณใช้จริง)

  let splitStatus = status || "UNPAID";

  // ตัวอย่างเงื่อนไขง่าย ๆ สมมติ payer ไม่ต้องจ่าย (เพราะจ่ายไปแล้ว)
  if (userId === ownerId) {
    splitStatus = "PAID";
  }

  return await prisma.expenseSplit.create({
    data: {
      userId: Number(userId),
      amount: Number(amount),
      status: splitStatus,
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

import * as expenseService from '../services/expense.service.js'

export const createExpense = async (req, res, next) => {
  try {
    const { expenseId } = req.params
    const expense = await expenseService.createExpense(expenseId, req.body)
    res.json({ message: 'Create split successfully', expense })
  } catch (err) {
    next(err)
  }
}

export const getExpenseById = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const expense = await expenseService.getExpenseById(id)
    res.json(expense)
  } catch (err) {
    next(err)
  }
}

export const updateExpense = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const updated = await expenseService.updateExpense(id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const deleteExpense = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const deleted = await expenseService.deleteExpense(id)
    res.json(deleted)
  } catch (err) {
    next(err)
  }
}

export const getExpensesByGroupId = async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId)
    const expenses = await expenseService.getExpensesByGroupId(groupId)
    res.json(expenses)
  } catch (err) {
    next(err)
  }
}

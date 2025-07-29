import * as expenseSplitService from '../services/splits.service.js'

export const listExpenseSplits = async (req, res, next) => {
  try {
    const { expenseId } = req.params
    const result = await expenseSplitService.listExpenseSplits(expenseId)
    res.json({ result })
  } catch (error) {
    next(error)
  }
}

export const createExpenseSplits = async (req, res, next) => {
  try {
    const { expenseId } = req.params
    const result = await expenseSplitService.createExpenseSplits(Number(expenseId), req.body)
    res.json({ message: 'Create split successfully', result })
  } catch (error) {
    next(error)
  }
}

export const updateExpenseSplit = async (req, res, next) => {
  try {
    const { splitId } = req.params
    const result = await expenseSplitService.updateExpenseSplit(Number(splitId), req.body)
    res.json({ result })
  } catch (error) {
    next(error)
  }
}

export const removeExpenseSplit = async (req, res, next) => {
  try {
    const { splitId } = req.params
    const result = await expenseSplitService.removeExpenseSplit(Number(splitId))
    res.json({ message: `Delete ${splitId} success`, result })
  } catch (error) {
    next(error)
  }
}

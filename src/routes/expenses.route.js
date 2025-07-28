import express from 'express'
import * as expenseController from '../controllers/expense.controller.js'
import splitsRouter from './splits.route.js'
import { createExpenseSchema, updateExpenseSchema, validate } from '../validations/expense.validator.js'

const expensesRouter = express.Router()

expensesRouter.post('/', validate(createExpenseSchema), expenseController.createExpense)
expensesRouter.get('/:id', expenseController.getExpenseById)
expensesRouter.patch('/:id', validate(updateExpenseSchema), expenseController.updateExpense)
expensesRouter.delete('/:id', expenseController.deleteExpense)
expensesRouter.get('/groups/:groupId/', expenseController.getExpensesByGroupId)

expensesRouter.use('/:expenseId/splits', splitsRouter)

export default expensesRouter

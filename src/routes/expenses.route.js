import express from 'express'
import * as expenseController from '../controllers/expense.controller.js'
import splitsRouter from './splits.route.js'
import { createExpenseSchema, updateExpenseSchema, validate } from '../validations/expense.validator.js'
import { authCheck } from '../middlewares/auth.middleware.js'

const expensesRouter = express.Router()

expensesRouter.post('/', authCheck, validate(createExpenseSchema), expenseController.createExpense)
expensesRouter.get('/:id', authCheck, expenseController.getExpenseById)
expensesRouter.patch('/:id', authCheck, validate(updateExpenseSchema), expenseController.updateExpense)
expensesRouter.delete('/:id', authCheck, expenseController.deleteExpense)
expensesRouter.get('/groups/:groupId/', authCheck, expenseController.getExpensesByGroupId)

expensesRouter.use('/:expenseId/splits', authCheck, splitsRouter)

export default expensesRouter

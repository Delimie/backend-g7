import express from 'express'
import { createExpenseSplits, listExpenseSplits, removeExpenseSplit, updateExpenseSplit } from '../controllers/splits.controller.js'
import { authCheck } from '../middlewares/auth.middleware.js'

const splitsRouter = express.Router({ mergeParams: true })

// Get splits for an expense
splitsRouter.get('/', authCheck, listExpenseSplits)

// Create new splits
splitsRouter.post('/', authCheck, createExpenseSplits)

// Update a specific split (optional)
splitsRouter.patch('/:splitId', authCheck, updateExpenseSplit)

splitsRouter.delete('/:splitId', authCheck, removeExpenseSplit)

export default splitsRouter
  
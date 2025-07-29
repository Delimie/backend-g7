import express from 'express'
import { createExpenseSplits, listExpenseSplits, removeExpenseSplit, updateExpenseSplit } from '../controllers/splits.controller.js'

const splitsRouter = express.Router({ mergeParams: true })

// Get splits for an expense
splitsRouter.get('/', listExpenseSplits)

// Create new splits
splitsRouter.post('/', createExpenseSplits)

// Update a specific split (optional)
splitsRouter.patch('/:splitId', updateExpenseSplit)

splitsRouter.delete('/:splitId', removeExpenseSplit)

export default splitsRouter

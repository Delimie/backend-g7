import express from 'express'
import splitsRouter from './splits.route.js'

const expensesRouter = express.Router()

// Create expense
expensesRouter.post('/', (req, res) => {
  res.send('Create new expense')
})

// Get expense by ID
expensesRouter.get('/:id', (req, res) => {
  res.send(`Get expense with ID: ${req.params.id}`)
})

// Update expense
expensesRouter.patch('/:id', (req, res) => {
  res.send(`Update expense with ID: ${req.params.id}`)
})

// Delete expense
expensesRouter.delete('/:id', (req, res) => {
  res.send(`Delete expense with ID: ${req.params.id}`)
})

// Get all expenses in group
expensesRouter.get('/groups/:groupId/expenses', (req, res) => {
  res.send(`Get all expenses in group ID: ${req.params.groupId}`)
})

// Mount splitsRouter: /expenses/:id/splits
expensesRouter.use('/:id/splits', splitsRouter)

export default expensesRouter

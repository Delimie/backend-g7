import express from 'express'

const splitsRouter = express.Router({ mergeParams: true })

// Get splits for an expense
splitsRouter.get('/', (req, res) => {
  res.send(`Get splits for expense ID: ${req.params.id}`)
})

// Create new splits
splitsRouter.post('/', (req, res) => {
  res.send(`Create splits for expense ID: ${req.params.id}`)
})

// Update a specific split (optional)
splitsRouter.patch('/:splitId', (req, res) => {
  res.send(`Update split ID: ${req.params.splitId} in expense ID: ${req.params.id}`)
})

export default splitsRouter

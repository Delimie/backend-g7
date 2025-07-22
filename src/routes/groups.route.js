import express from 'express'

const groupRouter = express.Router()

// Create group
groupRouter.post('/', (req, res) => {
  res.send('Create group')
})

// Get group by ID
groupRouter.get('/:id', (req, res) => {
  res.send(`Get group with ID: ${req.params.id}`)
})

// Update group
groupRouter.patch('/:id', (req, res) => {
  res.send(`Update group with ID: ${req.params.id}`)
})

// Delete group
groupRouter.delete('/:id', (req, res) => {
  res.send(`Delete group with ID: ${req.params.id}`)
})

// Add user to group
groupRouter.post('/:id/users', (req, res) => {
  res.send(`Add user to group ID: ${req.params.id}`)
})

// Remove user from group
groupRouter.delete('/:id/users/:userId', (req, res) => {
  res.send(`Remove user ${req.params.userId} from group ID: ${req.params.id}`)
})

// Get users in group
groupRouter.get('/:id/users', (req, res) => {
  res.send(`Get users in group ID: ${req.params.id}`)
})

groupRouter.get('/:groupId/summary', (req, res) => {
  res.send(`Get summary for group ID: ${req.params.groupId}`)
})

export default groupRouter

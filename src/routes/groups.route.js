import express from 'express'

const groupRouter = express.Router()


groupRouter.post('/', (req, res) => {
  // handle create group
  res.send('Create group')
})

groupRouter.get('/:id', (req, res) => {
  // handle get group by id
  res.send(`Get group with ID: ${req.params.id}`)
})

groupRouter.patch('/:id', (req, res) => {
  // handle update group
  res.send(`Update group with ID: ${req.params.id}`)
})

groupRouter.delete('/:id', (req, res) => {
  // handle delete group
  res.send(`Delete group with ID: ${req.params.id}`)
})

groupRouter.post('/:id/users', (req, res) => {
  // handle add user to group
  res.send(`Add user to group ID: ${req.params.id}`)
})

groupRouter.delete('/:id/users/:userId', (req, res) => {
  // handle remove user from group
  res.send(`Remove user ${req.params.userId} from group ID: ${req.params.id}`)
})

groupRouter.get('/:id/users', (req, res) => {
  // handle get users in group
  res.send(`Get users in group ID: ${req.params.id}`)
})

export default groupRouter

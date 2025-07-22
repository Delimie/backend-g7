import express from "express";

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('test get all users')
})
userRouter.patch('/:id', (req, res) => {
  res.send('test patch users')
})
userRouter.delete('/:id', (req, res) => {
  res.send('test delete users')
})
userRouter.get('/:id', (req, res) => {
  res.send('test get users id')
})
userRouter.get('/:id/balance', (req, res) => {
  res.send(`Get balance for user ID: ${req.params.id}`)
})

export default userRouter;
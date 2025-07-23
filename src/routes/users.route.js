import express from "express";
import { getMe, getUserById, listUser, removeUser, updateUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get('/', listUser)
userRouter.patch('/:id', updateUser)
userRouter.delete('/:id', removeUser)
userRouter.get('/:id', getUserById)
userRouter.get('/:id/balance', (req, res) => {
  res.send(`Get balance for user ID: ${req.params.id}`)
})

userRouter.get('/getme', getMe)

export default userRouter;
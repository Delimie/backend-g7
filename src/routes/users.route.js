import express from "express";
import { getMe, getUserById, listUser, removeUser, updateUser } from "../controllers/user.controller.js";
import { authCheck } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get('/getme', authCheck, getMe)

userRouter.get('/', authCheck, listUser)
userRouter.patch('/:id', authCheck, updateUser)
userRouter.delete('/:id', authCheck, removeUser)
userRouter.get('/:id', authCheck, getUserById)
userRouter.get('/:id/balance', (req, res) => {
  res.send(`Get balance for user ID: ${req.params.id}`)
})



export default userRouter;
import express from "express";
import { forgotPassword, login, register, resetPassword } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "../validations/validator.js";

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password/:token', resetPassword)

export default authRouter;
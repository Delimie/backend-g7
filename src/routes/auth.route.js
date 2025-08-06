import express from "express";
import { forgotPassword, login, loginGoogle, register, resetPassword } from "../controllers/auth.controller.js";
import { googleLoginSchema, loginSchema, registerSchema, validate } from "../validations/validator.js";

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), register)
authRouter.post("/google-login", validate(googleLoginSchema), loginGoogle);
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password/:token', resetPassword)

export default authRouter;
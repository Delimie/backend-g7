import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema, validate } from "../validations/validator.js";

const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)

export default authRouter;
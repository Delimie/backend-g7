import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js";
import notFound from "./src/utils/not-found.js";
import error from "./src/utils/error.js";
import groupRouter from "./src/routes/groups.route.js";
import userRouter from "./src/routes/users.route.js";
import appointmentRouter from "./src/routes/appointment.route.js";
import expensesRouter from './src/routes/expenses.route.js'
import locationsRouter from './src/routes/locations.route.js'
import debtTransactionRouter from "./src/routes/debtTransaction.route.js";

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/groups', groupRouter)
app.use('/users', userRouter)
app.use('/appointments', appointmentRouter)
app.use('/debts', debtTransactionRouter)
app.use('/expenses', expensesRouter)
app.use('/locations', locationsRouter)

app.use(notFound)
app.use(error)

export default app
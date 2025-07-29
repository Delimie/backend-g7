import express from "express";
import { confirmTransaction, debtSummary, getTransactions, updateDebtTransaction } from "../controllers/debtTransaction.controller.js";

const debtTransactionRouter = express.Router();

debtTransactionRouter.get('/groups/:groupId/debt-summary', debtSummary)
debtTransactionRouter.post('/:id', updateDebtTransaction)
debtTransactionRouter.get('/groups/:groupId/transactions', getTransactions)
debtTransactionRouter.patch('/debt-transactions/:id/confirm', confirmTransaction)

export default debtTransactionRouter;
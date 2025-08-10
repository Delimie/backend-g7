import express from "express";
import { confirmTransaction, debtSummary, getTransactions, updateDebtTransaction, uploadSlipController } from "../controllers/debtTransaction.controller.js";
import { uploadSlip } from "../middlewares/upload.middleware.js";

const debtTransactionRouter = express.Router();

debtTransactionRouter.get('/groups/:groupId/debt-summary', debtSummary)
debtTransactionRouter.post('/:id', updateDebtTransaction)
debtTransactionRouter.get('/groups/:groupId/transactions', getTransactions)
debtTransactionRouter.patch('/debt-transactions/:id/confirm', confirmTransaction)
debtTransactionRouter.patch("/transactions/:id/upload-slip", uploadSlip, uploadSlipController);


export default debtTransactionRouter;
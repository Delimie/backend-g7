import express from "express";

const debtTransactionRouter = express.Router();

debtTransactionRouter.post('/groups/:groupId/debt-transactions', (req, res) => {
  res.send('test create transaction')
})
debtTransactionRouter.get('/groups/:groupId/debt-summary', (req, res) => {
  res.send('test get preview transaction')
})
debtTransactionRouter.get('/groups/:groupId/debt-transactions', (req, res) => {
  res.send('test get group transaction')
})
debtTransactionRouter.patch('/debt-transactions/:id/confirm', (req, res) => {
  res.send('test confirm transaction')
})

export default debtTransactionRouter;
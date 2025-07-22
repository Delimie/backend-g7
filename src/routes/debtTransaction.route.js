import express from "express";

const debtTransactionRouter = express.Router();

debtTransactionRouter.post('/', (req, res) => {
  res.send('test create transaction')
})
debtTransactionRouter.get('/:id', (req, res) => {
  res.send('test get transaction')
})
debtTransactionRouter.get('/user/:id', (req, res) => {
  res.send('test get user transaction')
})
debtTransactionRouter.patch('/:id/confirm', (req, res) => {
  res.send('test confirm transaction')
})

export default debtTransactionRouter;
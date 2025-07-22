import express from "express";

const appointmentRouter = express.Router();

appointmentRouter.post('/', (req, res) => {
  res.send('test create appointment')
})
appointmentRouter.get('/', (req, res) => {
  res.send('test get all appointment')
})
appointmentRouter.patch('/:id', (req, res) => {
  res.send('test edit appointment')
})
appointmentRouter.delete('/:id', (req, res) => {
  res.send('test delete appointment')
})
appointmentRouter.post('/:id/invite', (req, res) => {
  res.send('test invite appointment')
})
appointmentRouter.get('/user/:userId', (req, res) => {
  res.send('test get all user appointment')
})

export default appointmentRouter;
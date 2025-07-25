import express from "express";
import { createAppointment, listAppointment, removeAppointment, updateAppointment } from "../controllers/appointment.controller.js";

const appointmentRouter = express.Router();

appointmentRouter.post('/', createAppointment)
appointmentRouter.get('/', listAppointment)
appointmentRouter.patch('/:id', updateAppointment)
appointmentRouter.delete('/:id', removeAppointment)
appointmentRouter.post('/:id/invite', (req, res) => {
  res.send('test invite appointment')
})
appointmentRouter.get('/user/:userId', (req, res) => {
  res.send('test get all user appointment')
})

export default appointmentRouter;
import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.js";

export const createAppointment = async (req, res, next) => {
  try {
    const { title, point, locationId, startTime, endTime } = req.body

    const hasLocation = await prisma.location.findFirst({
      where: { id: Number(locationId) }
    })
    if (!hasLocation) createError(400, 'Location not found')

    const appointment = await prisma.appointment.create({
      data: {
        title: title,
        point: point,
        locationId: locationId,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    })
    res.json({ result: appointment })
  } catch (error) {
    next(error)
  }
}

export const listAppointment = async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findMany()
    res.json({ result: appointment })
  } catch (error) {
    next(error)
  }
}

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, point, startTime, endTime } = req.body
    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        title: title,
        point: Number(point),
        startTime: new Date(startTime),
        endTime: new Date(endTime)
      }
    })
    res.json({ result: appointment })
  } catch (error) {
    next(error)
  }
}

export const removeAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const appointment = await prisma.appointment.delete({
      where: { id: Number(id) }
    })
    res.json({ message: 'Delete successfully', result: appointment })
  } catch (error) {
    next(error)
  }
}
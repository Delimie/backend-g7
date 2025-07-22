import express from 'express'

const locationsRouter = express.Router()


locationsRouter.post('/', (req, res) => {
  res.send('Create location')
})

locationsRouter.get('/:id', (req, res) => {
  res.send(`Get location with ID: ${req.params.id}`)
})

locationsRouter.get('/appointments/:id/location', (req, res) => {
  res.send(`Get location for appointment ID: ${req.params.id}`)
})

export default locationsRouter

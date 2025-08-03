import express from 'express'
import * as channelController from '../controllers/channel.controller.js'
import { authCheck } from '../middlewares/auth.middleware.js'

const channelRouter = express.Router()

channelRouter.get('/my', authCheck, channelController.getMyChannels)

channelRouter.post('/',authCheck, channelController.createNewChannel)
channelRouter.get('/:id',authCheck, channelController.getChannelByGroupId)
channelRouter.patch('/:id',authCheck, channelController.updateChannel)
channelRouter.delete('/:id',authCheck, channelController.deleteChannel)



export default channelRouter
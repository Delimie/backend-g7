import express from 'express'
import * as channelController from '../controllers/channel.controller.js'
import { authCheck } from '../middlewares/auth.middleware.js'

const channelRouter = express.Router()

channelRouter.post('/',authCheck, channelController.createNewChannel)
channelRouter.get('/:id', channelController.getChannelByGroupId)
channelRouter.patch('/:id', channelController.updateChannel)
channelRouter.delete('/:id', channelController.deleteChannel)


export default channelRouter
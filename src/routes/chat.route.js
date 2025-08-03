import express from 'express'
import * as chatController from '../controllers/chat.controller.js'
import { authCheck } from '../middlewares/auth.middleware.js'

const chatRouter = express.Router()

chatRouter.get('/:channelId', authCheck, chatController.getChatsByChannelId)

export default chatRouter
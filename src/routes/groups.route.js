import express from 'express'
import * as groupController from '../controllers/group.controller.js'
import { authCheck } from '../middlewares/auth.middleware.js'

const groupRouter = express.Router()

groupRouter.post('/',authCheck, groupController.createGroup)
groupRouter.get('/:id', groupController.getGroupById)
groupRouter.patch('/:id', groupController.updateGroup)
groupRouter.delete('/:id', groupController.deleteGroup)

groupRouter.post('/:id/users', groupController.addUserToGroup)
groupRouter.delete('/:id/users/:userId', groupController.removeUserFromGroup)
groupRouter.get('/:id/users', groupController.getUsersInGroup)

groupRouter.get('/:groupId/summary', groupController.getGroupSummary)

export default groupRouter

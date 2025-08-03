import express from 'express'
import * as groupController from '../controllers/group.controller.js'
import { authCheck } from '../middlewares/auth.middleware.js'

const groupRouter = express.Router()

groupRouter.get('/my', authCheck, groupController.getMyGroups)

groupRouter.post('/',authCheck, groupController.createGroup)
groupRouter.get('/:id', authCheck, groupController.getGroupById)
groupRouter.patch('/:id', authCheck, groupController.updateGroup)
groupRouter.delete('/:id', authCheck, groupController.deleteGroup)

groupRouter.post('/:id/users', authCheck, groupController.addUserToGroup)
groupRouter.delete('/:id/users/:userId', authCheck, groupController.removeUserFromGroup)
groupRouter.get('/:id/users', authCheck, groupController.getUsersInGroup)

groupRouter.get('/:groupId/summary', authCheck, groupController.getGroupSummary)

export default groupRouter

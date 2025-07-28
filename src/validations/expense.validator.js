import { object, string, number, date } from 'yup'
import createError from '../utils/create-error.js'

export const createExpenseSchema = object({
  groupId: number().required('Group ID is required'),
  userId: number().required('User ID (payer) is required'),
  title: string().required('Expense title is required'),
  amount: number().positive('Amount must be positive').required('Amount is required'),
  receiptImage: string().required('Receipt image is required'),
  date: date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
}).noUnknown()

export const updateExpenseSchema = object({
  title: string().optional(),
  amount: number().positive('Amount must be positive').optional(),
  date: date()
    .max(new Date(), 'Date cannot be in the future')
    .optional(),
  receiptImage: string().optional(),
}).noUnknown()

export const validate = (schema, options = {}) => {
  return async (req, res, next) => {
    try {
      const cleanData = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        ...options
      })
      req.body = cleanData
      next()
    } catch (err) {
      const errorMessage = err.errors.join('|||')
      console.log('[Expense Validation Error]', errorMessage)
      next(createError(400, errorMessage))
    }
  }
}

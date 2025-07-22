import { object, string, number, date, ref } from "yup";
import createError from "../utils/create-error.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const thaiMobileRegex = /^0[0-9]{9}$/

export const registerSchema = object({
  name: string().required(),
  identity: string().test(
    'Identity check',
    'Identity must be a valid email or mobile number',
    (value) => {
      if (!value) { return true }
      return emailRegex.test(value) || thaiMobileRegex.test(value)
    }
  ),
  password: string().min(6).required(),
  confirmPassword: string().oneOf([ref("password")], 'confirmPassword must match password'),
  email: string().email(),
  mobile: string().matches(thaiMobileRegex),
  birthDate: date().required('Enter your birth date').max(new Date(), 'Birth date must not be in the future'),
  gender: string().oneOf(['men', 'women', 'others'], 'Gender must be either "men" or "women" or "others'),
  occupation: string().required('Enter your occupation'),
  address: string().required('Enter your province')
}).noUnknown()
  .transform((value) => {
    if (value.email || value.mobile) {
      delete value.identity
      return value
    }
    const newValue = { ...value, [emailRegex.test(value.identity) ? 'email' : 'mobile']: value.identity }
    delete newValue.identity
    return newValue
  }).test(
    'require-identity-or-mobile-or-email',
    'At least one of identity, email, or mobile must be provided',
    value => {
      return Boolean(value.identity || value.email || value.mobile)
    }
  )

export const loginSchema = object({
  identity: string().test(
    'Identity check',
    'Identity must be a valid email or mobile number',
    (value) => {
      if (!value) { return true }
      return emailRegex.test(value) || thaiMobileRegex.test(value)
    }
  ),
  password: string().min(6).required(),
  email: string().email(),
  mobile: string().matches(thaiMobileRegex)
}).transform(value => {
  return ({ ...value, [emailRegex.test(value.identity) ? 'email' : 'mobile']: value.identity })
}).noUnknown()

export const validate = (schema, option = {}) => {
  return async function (req, res, next) {
    try {
      const cleanBody = await schema.validate(req.body, { abortEarly: false, ...option })
      req.body = cleanBody
      next()
    } catch (err) {
      let errMsg = err.errors.join('|||')
      console.log(errMsg)
      createError(400, errMsg)
    }
  }
}
import { object, string, number, date, ref } from "yup";

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
  mobile: string().matches(thaiMobileRegex)
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
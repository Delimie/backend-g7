export default function createError(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}
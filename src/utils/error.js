// const error = (err, req, res, next) => {
//   console.log(err.message)
//   res.status(err.code || 500).json({ message: err.message || "Something Wrong !!" })
// }

// export default error;

const error = (err, req, res, next) => {
  console.log(err.message)

  const statusCode = Number.isInteger(err.status) ? err.status
    : (err.code === 'ENOENT' ? 404 : 500)

  res.status(statusCode).json({ message: err.message || "Something Wrong !!" })
}

export default error
import prisma from "../config/prisma.config.js";
import jwt from "jsonwebtoken";
import createError from "../utils/create-error.js";

export const authCheck = (req, res, next) => {
  try {
    const header = req.headers.authorization
    // console.log('header', header)
    if (!header) createError(401, 'Token is missing !')

    const token = header.split(' ')[1]
    // console.log('token', token)
    jwt.verify(token, process.env.SECRET, (error, decode) => {
      // console.log('decode', decode)
      if (error) createError(401, 'Token is invalid !')
      req.user = decode
    // console.log('authCheck set req.user:', req.user)
      next()
    })
  } catch (error) {
    next(error)
  }
}
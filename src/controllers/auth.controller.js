import prisma from "../config/prisma.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../utils/create-error.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, birthDate, gender, occupation, address, profileImage, coverImage } = req.body
    if (email) {
      let foundEmail = await prisma.user.findUnique({
        where: { email: email }
      })
      if (foundEmail) createError(409, `Email: ${email} already register`)
    }
    if (mobile) {
      let foundUserName = await prisma.user.findUnique({
        where: { mobile: mobile }
      })
      if (foundUserName) createError(409, `Username: ${mobile} already register`)
    }
    const hashPassword = bcrypt.hashSync(password, 10)
    const result = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        mobile: mobile,
        birthDate: new Date(birthDate),
        gender: gender,
        occupation: occupation,
        address: address
      }
    })
    console.log(result)
    res.json({ message: 'Register successfully!' })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { identity, email, mobile, password } = req.body
    // console.log(req.body)
    const identityKey = email ? 'email' : 'mobile'
    // console.log(identityKey)
    // const identityValue = identity ? identity : email ? email : mobile
    const foundUser = await prisma.user.findFirst({
      where: {
        [identityKey]: email ? email : mobile
        // OR: [
        //   { email: identity },
        //   { mobile: identity }
        // ]
      }
    })
    if (!foundUser) createError(401, 'Invalid Login')

    const checkPassword = bcrypt.compareSync(password, foundUser.password)
    if (!checkPassword) createError(401, 'Invalid Login')

    const payload = { id: foundUser.id }
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "30d"
    })

    const { password: pw, createdAt, updatedAt, coverImage, ...userData } = foundUser
    res.json({ message: "Login successful", token: token, user: userData })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await prisma.user.findUnique({
      where: { email: email }
    })
    if (!user) createError(400, 'User not found')

    const frontURL = "http://localhost:5173/reset-password"

    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.RESET_SECRET, {
      algorithm: "HS256",
      expiresIn: "30d"
    })
    const link = `${frontURL}/${token}`

    res.json({ message: "Reset password link", link })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  const { token } = req.params
  const { password } = req.body
  try {
    const payload = jwt.verify(token, process.env.RESET_SECRET, {
      algorithms: ["HS256"],
    });
    // console.log("payload =>", payload)
    const id = payload.id
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hash }
    })
    res.json({ message: "Password reset successful", user: { id: user.id, email: user.email } })
  } catch (error) {
    next(error)
  }
}
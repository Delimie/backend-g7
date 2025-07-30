import multer from "multer";
import path from 'path';

// console.log(process.cwd())
// console.log(import.meta.url)

// let picPath = process.cwd() + '/' + 'temp-pic'
// console.log(picPath)

// // Window Path เพื่อใช้ multer กำนหด path ในการลง files
// let picPath2 = path.join(process.cwd(), 'temp-pic')
// console.log(picPath2)

const dest = path.join(process.cwd(), 'temp-pic')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dest),
  filename: (req, file , cb) => {
    let fileExt = path.extname(file.originalname)
    let fileName = `pic_${Date.now()}_${Math.round(Math.random()*100)}${fileExt}`
    cb(null, fileName)
  }
})

const upload = multer({ storage })

export const uploadUserImages = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'qrCode', maxCount: 1 }
])
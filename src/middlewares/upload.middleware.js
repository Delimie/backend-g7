import multer from "multer";
import path from 'path';


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

// สำหรับ user profile
export const uploadUserImages = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'qrCode', maxCount: 1 }
])

// ✅ สำหรับ slip อัปโหลดเดี่ยว
export const uploadSlip = upload.single("slip");
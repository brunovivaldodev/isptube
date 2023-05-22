import { Router} from "express"

import { progress_middleware } from "./middlewares"
import uploadConfig from "../config/upload"
import multer from "multer"

const uploadAvatar = multer(uploadConfig('./uploads'))

const router = Router()
router.post("",progress_middleware,uploadAvatar.single('file'),(request,response)=>{
    response.status(200).send('File uploaded');
})

export default router
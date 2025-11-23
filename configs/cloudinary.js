import {v2 as cloudinary} from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.envCLOUDINARY_API_KEY ,
    secret_key: process.env.CLOUDINARY_SECRET_KEY
})

export default cloudinary


import express from "express"
import 'dotenv/config'
import authRoutes from  '../Routes/authRoutes.js'
import BookRoutes from  '../Routes/BookRoutes.js'
import cors from 'cors'

import { connectDB } from "../configs/db.js";



const app = express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 3000


app.use("/api/auth" , authRoutes)
app.use("/api/book" , BookRoutes)



app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
 connectDB()

})
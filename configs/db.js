import mongoose from 'mongoose'
import 'dotenv/config'


export const connectDB = async () =>{

    try {
        
          mongoose.connection.on('connectdb' , ()=>console.log('database connected'))
          await mongoose.connect("mongodb+srv://hafizhaseeb4480_db_user:uNZxfur3PNsVACpm@cluster0.mz1lupq.mongodb.net/books_db?appName=Cluster0")   
         console.log('database connected')                 
    } catch (error) {
        console.log(error)
        process.exit(1)
    }

}

import mongoose from "mongoose";


const BookSchema = new mongoose.Schema({

    
    title:{
        type:String,
        require:true, 
    },
    caption:{
        type:String,
        require:true, 
    },
    image:{
        type:String,
        require:true, 
    },
    rating:{
        type:String,
        require:true,
        min:1,
        max:5, 
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      requird:true      
    }

},{timestamps:true})

const Books = mongoose.model("Books", BookSchema)


export default Books


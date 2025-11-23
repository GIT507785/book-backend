import express from "express";
import cloudinary from "../configs/cloudinary.js";
import Books from "../Models/Book.js";
import protectRoute from "../Middleware/ProtectRoute.js";

const router =  express.Router()


router.post('/', protectRoute ,async (req , res)=>{

    try {
        
        const {title , caption , rating , image} = req.body

        if(!title || !caption || !rating || !image ){
        return res.status(400).json({ message: "All fields are required" });
        }

        //upload the image to cloudinary 
        const uploadResponse =  await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url
         //save to database

         const newBook =  await Books({
            title,caption,
            rating, image:imageUrl,
            user:req.user._id
         })

         await newBook.save()
       
         res.status(201).json(newBook);


    } catch (error) {
               console.error('Error creating book:', error);
            return res.status(500).json(error.message);            
    }

})


//paginarion => infinite loading
router.get('/' , protectRoute , async (req, res)=>{

    try {

         const page = req.query.page || 1
         const limit = req.query.page || 5
         const skip =   (page -1) * limit   

         const books = await Books.find().sort({createdAt: -1}).skip(skip).limit(limit).populate("user", "username profileImage") //descending order
          const totalBooks = await Books.countDocuments();
         res.send({books,
            currentPge:page,
            totalBooks,
            totalPages:Math.cell(totalBooks / limit),
         })
    } catch (error) {
          console.error('Error in get book:', error);
            return res.status(500).json({message: 'Internal server error'});
    }

})

router.get('/:id' , protectRoute ,async (req, res)=>{


    try {
        const book = await Books.findById(req.params.id)
        if(!book) {
            return res.status(401).json({message:'Book not Found'})
        }
        if(book.user.toString() !== req.user._id.toString())
            return res.status(401).json({message:'Unauthorized'})

        //deleting book from cloudinary
        try {
            if(book.image &&  book.image.includes('cloudinary')) {
                const publicId = book.image.split("/").pop().split(".")[0] 
                await  cloudinary.uploader.destroy(publicId)
         }
        } catch (deleteError) {
               console.error('Error deleting image from cloudinary', deleteError);
        }

           
        await book.deleteOne()

        res.json({message: 'Book deleted successfully'})
    } catch (error) {
     
               console.error('Error in get book:', error);
            return res.status(500).json({message: 'Internal server error'});
    
    }

})

//get recomemded books by loaded user
router.get('/user', protectRoute , async (req, res)=>{
    try {
        const books = await Books.find({user: req.user._id}).sort({createdAt: -1})
        res.json(books)
    } catch (error) {
        
           console.error('get user books error:', error.message);
            return res.status(500).json({message: 'Server Error'});
    }
}) 





export default router
import express from "express";
import UserModel from "../Models/User.js";
import jwt from 'jsonwebtoken' 
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv';
dotenv.config(); 



const router = express.Router()

 export const generateToken = (userId) =>{
    return jwt.sign({id:userId}, process.env.JWT_SECRET , {expiresIn: "7d"})
  }

  router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (username.length < 3) {
      return res.status(400).json({ success: false, message: "Username should be at least 3 characters long" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password should be at least 6 characters long" });
    }

    // Check if email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // Check if username already exists
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "User already exists with this username" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate default profile image
    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=Brian${username}`;

    // Create user
    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
      profileImage,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error('Error in register route:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

  router.post('/login', async(req, res)=>{
      try {
        
          const {email , password} = req.body
          
          if(!email  || !password ){
             return  res.json({success:false , message: 'Missing required fields'})
            }

         //check if ser exists
           const user = await UserModel.findOne({email})
           if(!user){
            return res.status(400).json({success:false , message:'invalid emal and password'})
           }


            const comparePassword = await bcrypt.compare(password , user.password)
            
            if(!comparePassword){
            return res.status(400).json({success:false , message:'invalid emal and password'})
            }

            
                // Generate JWT token
    const token = generateToken(user._id);

    // Return user info and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      token,
    });
             
                 
         } catch (error) {
               
            console.error('Error in login route:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });    
            
         }
  })



    export default router
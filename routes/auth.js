const express = require("express"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const UserModel = require("../models/userSchema.js")
const router = express.Router();

// registration and login
router.post("/registration",async(req,res)=>{
    try {
        const {username, password} = req.body;

        if(!username || !password){
          return res.status(422).json({err:"Enter your username & password"})
         }

      // check if user exists!
      const isUserExist = await UserModel.findOne({username:username});

      if(isUserExist){
        return res.status(422).json({err:"Username already exists"});
      }
      // hash the password
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync())

      const userCreated = new UserModel({username:username,password:hashedPassword})
      const userSaved = await userCreated.save();

      if(userSaved) return res.status(200).json({message:"User registered successfully"});

    } catch (error) {
        res.sendStatus(500);
    }

});


router.post("/login",async(req,res)=>{
    try {
         const {username, password} = req.body;

         if(!username || !password){
          return res.status(422).json({message:"Enter your username & password"})
         }

         const user = await UserModel.findOne({username:username});
         // if user is not registered
         if(!user) return res.status(422).json({err:"User is not registered"});
         // verify the password 
         const verifyPassword = bcrypt.compareSync(password,user.password);

         if(!verifyPassword){
            return res.status(422).json({err:"Password do not match"});
         }
         //  generate a token
         const token = jwt.sign({id:user._id},process.env.SECRET_KEY);
        
         return res.status(200).json({token, userID:user._id, userName:user.username, message:"Login successfull"})

    } catch (err){
        res.sendStatus(500);
    }


});

// middleware - verify the jwt token.
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      jwt.verify(authHeader, process.env.SECRET_KEY, (err) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };



module.exports = {router,verifyToken};

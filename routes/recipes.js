const express = require("express");
const router = express.Router();
const UserModel = require("../models/userSchema");
const Recipe = require("../models/recipeSchema");
const {verifyToken} = require('./auth.js')




// Get all recipes
router.get("/",async(req,res)=>{
    try {
     const allRecipes = await Recipe.find({});
     if(allRecipes) return res.status(200).json({message:"Success", allRecipes});

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}) 

// Create recipe
router.post('/createRecipe',async(req,res)=>{
    try {
        const {name,ingredients,imgUrl,description,userId} = req.body;

        if(!name || !ingredients || !imgUrl || !description || !userId){
            return res.status(422).json({err:"Fields cannot be empty"})
        }
        const newRecipe = new Recipe({name,ingredients,imgUrl,description,recipeOwner:userId.toString()});
        const savedRecipe = await newRecipe.save();

        if(savedRecipe) {
            return res.status(200).json({savedRecipe,message:"New recipe has been created succcessfully"})
            
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
})




// save a recipe 
router.put("/saveRecipe",verifyToken,async(req,res)=>{
    try {
        const userId = req.body.userId?.toString();
        const recipeId = req.body.recipeId?.toString();

        const user = await UserModel.findOne({_id:userId});

        // is saved ?
        if(user.savedRecipe.includes(recipeId)){
            return res.status(422).json({err:"Already Saved"})
        }
        user.savedRecipe.push(recipeId);
        await user.save();

        return res.status(200).json({isSaved:true});

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// get id of saved recipe
router.get("/savedRecipe/:id",async(req,res)=>{
    const userId = req.params.id;
    
        try {
            const user = await UserModel.findById({_id: userId });
            return res.status(200).json({savedRecipeId:user?.savedRecipe})

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    
   
})

// Get saved recipe of the user
router.get("/savedRecipe/user/:id",async(req,res)=>{
    try {
        const userId = req.params.id;
        const user = await UserModel.findById({_id:userId.toString()});

        const userRecipe = await Recipe.find({_id:{$in:user?.savedRecipe}});
        if(userRecipe) return res.status(200).json({savedRecipe:userRecipe})
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


module.exports = router;


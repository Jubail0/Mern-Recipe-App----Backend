const mongoose = require("mongoose");


const RecipeSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    ingredients:[{
        type:String
    }],
    imgUrl:{
        type:String
    },
    description:{
        type:String
    },
    recipeOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
  timestamp:true
})

const Recipe = mongoose.model("recipes",RecipeSchema);

module.exports = Recipe;
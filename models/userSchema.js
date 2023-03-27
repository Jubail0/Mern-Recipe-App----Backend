const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    savedRecipe:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Recipe",
        required:true
    }]
},{
    timestamps:true
})

const UserModel = mongoose.model("users",UserSchema);

module.exports = UserModel;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const {router}= require("./routes/auth");



const app = express();
dotenv.config({path:'./config.env'});
app.use(cors());
app.use(express.json());
app.use(router);
app.use(require("./routes/recipes"));

mongoose.connect(process.env.DB)
.then(()=> console.log("Connection successfull"))


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`)
})



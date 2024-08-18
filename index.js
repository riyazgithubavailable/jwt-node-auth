const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userModel = require("./models/userModel");
const jwt = require("jsonwebtoken");
//file import
const {userAuthentication,isEmailRgex} = require("./utils/auth");
const generateToken = require("./utils/tokenGenerate")
const bcrypt = require("bcryptjs")
const app = express();
//middlewear
const verifyToken = require("./middleware/authMiddle")
const PORT = process.env.PORT || 8000;
//db connection 
mongoose.connect(process.env.MONGOOSE_URI)
.then(()=>{
    console.log("Mongo Db connect successfully")
}).catch(err=>{
    console.log(err)
})
//middlewear 
app.use(express.json());
//register api
app.post("/register",async (req,res)=>{
    const {name,email,userName,password} = req.body;
    try{
        await userAuthentication({name,email,userName,password})
    }catch(error){
        console.log(error)
        return res.send({
            status:400,
            error:error,
        })
    }
    try{
        const isEmailExist = await userModel.findOne({email})
        if(isEmailExist){
            return res.send({
                status:400,
                message:"email already exist",
            })
        }
        const isUserNameExist = await userModel.findOne({userName})
        if(isUserNameExist){
            return res.send({
                status:400,
                message:"userName already exist",
            })
        }
        const hashPassword = await bcrypt.hash(
            password,
            Number(process.env.SALT)
        );

        const userObj = new userModel({
            name:name,
            email:email,
            userName:userName,
            password:hashPassword,
        })
        const userDb = await userObj.save();
        return res.send({
            status:200,
            message:"user register successfully",
            user:userDb,
        })
    }catch(err){
        return res.send({
            status:500,
            message:"internal server error",
            error:err,
        })
    }
})
//Login api
app.post("/login",async(req,res)=>{
    const {loginId, password} = req.body;
    if(!loginId || !password) return res.send({
        status:400,
        message:"missing user crendential"
    });
    
    try{
        let user;
        if(isEmailRgex({str:loginId})){
          user = await userModel.findOne({email:loginId})
        }else{
            user =await userModel.findOne({userName:loginId})
        }
       if(!user) return res.send({
        status:401,
        message:"user not found registre first"
       })
       //compare password
       const isPassMatch = await bcrypt.compare(password,user.password);
       if(!isPassMatch) return res.send({
        status:400,
        message:"password is incorrect"
       })
       const token =  generateToken(user) ;
       return res.send({
        status:200,
        message:"Login successfull",
        user:user,
        token:token,

       })
    }catch(err){
        return res.send({
            status:500,
            message:"internal server error",
            error:err,
        })
    }
});
app.post("/profile",verifyToken,(req,res)=>{
     jwt.verify(req.token,process.env.SECRET_KEY,(err,authData)=>{
        if(err){
           return res.send({
                status:403,
                message:"token is invalid"
            })
        }else{
            const user = authData;
            return res.send({
                status:200,
                user:user,
            })
        }
     })
     return res.send({
        status:200,
        message:"Profile susscessful fetch",
        user:user,
     })
})
app.listen(PORT,()=>{
    console.log(`Server is running on Port${PORT}`)
});


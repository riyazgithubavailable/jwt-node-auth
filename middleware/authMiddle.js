
const authMiddle =(req,res,next)=>{
    try{
      const authHeader = req.headers['authorization'];
      if (typeof authHeader !== 'undefined') {
          const token = authHeader.split(" ")[1];
           req.token=token;
           next();
       }else{
         return res.send({ 
           status:401,  
           message: "Unauthorized" });
       }
    }catch(err){
      return res.send({
        status:500,
        message:"internal server error",
        error:err,
      })
    }
      
    }
  module.exports = authMiddle;
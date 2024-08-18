const jwt = require("jsonwebtoken");

function generateToken(user){ 
    const token = jwt.sign({id:user._id,email:user.email},process.env.SECRET_KEY);
    return token;
}
module.exports = generateToken;
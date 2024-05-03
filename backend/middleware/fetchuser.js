var jwt = require('jsonwebtoken');
const JWT_SECRET ='Akashisagood@boy';




 const fetchuser=(req,res,next)=>{
    //Get the User from the jwt token and add idto req object 
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"please auhenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        res.user = data.user;
         next(); 
    } catch (error) {
        res.status(401).send({error:"please auhenticate using a valid token"})
    }
  
 }

module.exports = fetchuser;

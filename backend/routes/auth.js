const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET ='Akashisagood@boy';


// Create a user using POST "/api/auth/createuser", doesn't require authentication . No login required
router.post(
  '/createuser',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must have a minimum of 5 characters').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If there are error , return Bad request and the errors.

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email exixts" });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password,salt);
      
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user:{
          id: user.id
         
        }
      }

      const authtoken = jwt.sign(data,JWT_SECRET);
    

      //res.json(user);
      res.json({authtoken})

    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

//Authenticate User using :POST "/apt/auth/login".No login required 
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password','Passwword cannot be blank').exists(),
  ],async(req,res)=>{

     //If there are error , return Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email,password} = req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"Please try to login with correct username and password"});
      }

      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        return res.status(400).json({error: "Please try to login with correct username and password"});
      }

      const data = {
        user:{
          id: user.id
         
        }
      }
       const authtoken = jwt.sign(data,JWT_SECRET);
       res.json({authtoken})

    }catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error occured");

    }

  })

module.exports = router

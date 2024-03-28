const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {body ,validationResult } = require('express-validator'); 


//Create a user using :POST "/api/auth/". Doesn't require Auth
router.post('/',[
  body('name','Enter a vail name').isLength({min:3}),
  body('email','Enter a valid email').isEmail(),
  body('password').isLength({min:3}),
],(req,res)=>{
  const result = validationResult(req);
if (result.isEmpty()) {
  return res.send(`Hello, ${req.query.person}!`);
}

res.send({ errors: result.array() });
  
  res.send(req.body);
    
})

module.exports = router


const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbUser = require('../models/users');

router.post('/api/signup', async (req, res) => {
    try {

      const { username, email, password, confirm_password } = req.body;
  
      const existingUser = await dbUser.findOne({ $or: [{ username }, { email }] });
  
      if (existingUser) {
        if (existingUser.username === username && existingUser.email === email) {
            return res.status(400).json({ error: 'Username and email are already in use' });
        } else if (existingUser.username === username) {
            return res.status(400).json({ error: 'username_taken' });
        } else if (existingUser.email === email) {
            return res.status(400).json({ error: 'email_taken' });
        }
     }

      if (password !== confirm_password) {
        return res.status(400).json({ error: 'Password and Confirmed Password do not match' });
      }

      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const numberRegex = /[0-9]/;
      const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/]+/;
      if (password.length < 8 || 
        !uppercaseRegex.test(password) || 
        !lowercaseRegex.test(password) || 
        !numberRegex.test(password) || 
        !specialCharRegex.test(password)) {
        return res.status(400).json({ error: 'Password did not meet requirments.' });
    }
     
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new dbUser({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });
        
      await newUser.save();
        
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
       
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error('Error registering user: ', error);
      res.status(500).json({ error: 'Error registering user. Please try again later.' });
    }
  });

  module.exports = router;

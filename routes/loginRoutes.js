const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbUser = require('../models/users');

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbUser.findOne({ $or: [{ username: email }, { email: email }] });

    if (!user) {
      return res.status(401).json({ error: 'Username or Email does not exist' });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });

    res.json({ message: 'Login successful', token, username: user.username });
  } catch (error) {
    console.error('Error logging in: ', error);
    res.status(500).json({ error: 'Error logging in. Please try again later.' });
  }
});

module.exports = router;



/*


*/
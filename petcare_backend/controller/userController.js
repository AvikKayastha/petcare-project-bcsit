import userModel from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
  try {
    let { name, email, password, cpassword, role } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json('User already exists');
    }
    
    // validate password/ compare with confirm password
    if (password !== cpassword) {
      return res.send('Passwords do not match');
    }
    
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // create user
    const createdUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    
    // generate token
    let token = jwt.sign({ email }, process.env.JWT_SECRET);
    
    // set cookie
    res.cookie('token', token, {
      httpOnly: true, // This cookie can only be used by the server, not by any JavaScript running in the browser.
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    // send response
    return res.status(201).send('User created successfully');
  } catch (error) {
    console.error("Error saving user:",err);
    return res.status(500).send('Server Error');
  }
};

// Login Route
export const loginUser = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.send('User not found');
    }
    
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (err) {
        return res.send('Server error');
      }
      if (result) {
        let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        res.cookie('token', token);
        res.send("/homepage");
      } else {
        res.send('Invalid password');
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.send('Server error');
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", "");
    res.redirect("/login-page.html");
  } catch (error) {
    console.error("Error logging out user:", error);
    res.send('Server error');
  }
};
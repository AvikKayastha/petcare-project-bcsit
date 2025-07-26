import userModel from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
  try {
    let { name, email, password, cpassword, role } = req.body;

     // Check if user with same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User with this email already exists");
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
    return res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).send("Server error while creating user");
  }
};

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
        let token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET);
        res.cookie('token', token);
      
        if (user.role === 'owner') {
          return res.redirect("/homepage");
        } else if (user.role === 'caretaker') {
          return res.redirect("/homepage");
        } else if (user.role === 'admin') {
          return res.redirect("/admin_dashboard");
        } else {
          return res.send("Unknown role");
        }
      } else {
        res.send('Invalid password');
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.send('Server error');
  }
};

export const getUserInfo = async (req, res) => {
  try {
    res.json({ email: req.user.email, role: req.user.role });
  } catch (err) {
    res.status(500).send("Failed to get user info");
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token",);
    res.redirect("/login_page");
  } catch (error) {
    console.error("Error logging out user:", error);
    res.send('Server error');
  }
};
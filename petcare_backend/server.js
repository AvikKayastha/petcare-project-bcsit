import express from 'express';
import userModel from './models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config(); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Root Route
app.get('/', (req, res) => {
  res.redirect('/login-page.html'); 
});

// register page
app.post('/create', async (req, res) => {
  let { email, password, cpassword } = req.body; 

  // validate password/ compare with confirm password
  if (password !== cpassword) {
    return res.send('Passwords do not match');
  }

  try{
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); 
    
    // create user
    const createdUser = await userModel.create({
      email,
      password: hashedPassword
    });

    // generate token
    let token = jwt.sign({ email }, process.env.JWT_SECRET);

    // set cookie
    res.cookie('token', token , {
      httpOnly: true, // This cookie can only be used by the server, not by any JavaScript running in the browser.
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // send response

  } catch (err) {
    console.error(err);
    return res.send('Server Error');
  }
});

// Login Route
app.post('/login', async function (req, res) {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.send('User not found');
  }
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if(result){
       let token = jwt.sign({email: user.email}, process.env.JWT_SECRET);
        res.cookie('token', token);
      res.send('Login successful');
    } 
    else {
      res.send('Invalid password');
    }
  })
})

// Logout 
app.get("/logout", function(req, res) {
  res.clearCookie("token", "");
  res.redirect("/login-page.html");
})

// Connect to DB and start server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
});

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
  res.redirect('/register.html'); 
});

app.post('/create', async (req, res) => {
  let { firstname, lastname, email, phonenumber, petname, pettype, petnickname } = req.body;

  let createdUser = await userModel.create({
    firstname,
    lastname,
    email,
    phonenumber,
    petname,
    pettype,
    petnickname
  })

res.send(createdUser);
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
});

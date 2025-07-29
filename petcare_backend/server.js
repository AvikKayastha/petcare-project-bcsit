import express from 'express';
import userModel from './models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRoutes from './route/userRoutes.js'; // Import user routes
import connectDB from './config/db.js';
import { verifyToken } from './middleware/authMiddleware.js'; // Import auth middleware

// ES Modules (import syntax), those are not available by default. So you need to manually define them like this
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config(); 
const __filename = fileURLToPath(import.meta.url);// __filename gives current file path
const __dirname = dirname(__filename); // __dirname gives current folder path
const isProduction = process.env.NODE_ENV === 'production';

// Token generators
function generateAccessToken(user) {
  return jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5m' }); // 5 min access
}

function generateRefreshToken(user) {
  return jwt.sign({ email: user.email }, process.env.REFRESH_SECRET, { expiresIn: '7d' }); // 7 day refresh
}


const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// static routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login-page.html'));
});

app.get('/homepage', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.get('/frontpage',  (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'frontpage.html'));
});

app.get('/adminDasboard', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'Admin-dashboard.html'));
});

app.get('/bookings-admin', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'Bookings(admin).html'));
});

app.get('/customers-admin', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'customers(admin).html'));
});

app.get('/messages-admin', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'Messages(admin).html'));
});


//Static Page Routes (Clean URL)
app.get('/homepage', (req, res) => res.sendFile(path.join(__dirname, 'public', 'homepage.html')));

// Use user routes under /api path
app.use('/api', userRoutes);

// Root Route
app.get('/', (req, res) => {
  res.redirect('/login'); 
});

// register page
app.post('/create', async (req, res) => {
  let {name, email, password, cpassword, role } = req.body; 

  // validate password/ compare with confirm password
  if (password !== cpassword) {
    return res.status(400).send('Passwords do not match');
  }

  try{
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
     const accessToken = generateAccessToken(createdUser);
    const refreshToken = generateRefreshToken(createdUser);

    // set access token cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: 'strict', // Prevent Cross-Site Request Forgery.
      secure: isProduction 
    });

     // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
      secure: isProduction // Enable secure cookies only in production (HTTPS) not http.
    });

    res.status(201).send('User registered successfully');

  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send('Invalid password');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('token', accessToken, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
    sameSite: 'strict',
    secure: isProduction
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    secure: isProduction
  });

  // Redirect based on role
  if (user.role === 'admin') {
    return res.redirect('/adminDasboard');
  } else {
    return res.redirect('/homepage');
  } 
});


// Logout 
app.post("/logout", function(req, res) {
  res.clearCookie("token");
  res.clearCookie("refreshToken");  
  res.redirect("/login");
})

// Connect to DB and start server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
});

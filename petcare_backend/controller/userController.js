import userModel from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// User Registration
export const createUser = async (req, res) => {
  try {
    const { name, email, password, cpassword, role } = req.body;

    if (password !== cpassword) return res.status(400).send("Passwords do not match");

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send("Email already in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error in user registration:", err);
    res.status(500).send("Server error");
  }
};

// Login (Handles all roles)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid password");

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    // Role-based redirection
    if (user.role === 'owner') {
      return res.redirect('/homepage');
    } else if (user.role === 'caretaker') {
      return res.redirect('/homepage');
    } else {
      return res.redirect('/login_page');
    }

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
};

export const getUserInfo = async (req, res) => {
  try {
    res.json({ email: req.user.email, role: req.user.role });
  } catch (err) {
    res.status(500).send("Failed to get user info");
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login_page');
};


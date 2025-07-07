import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  
  });


  // This line creates and exports a Mongoose model named 'user' based on the userSchema,
// allowing you to interact with the 'users' collection in MongoDB (e.g., create, read, update, delete documents).
  export default mongoose.model('user', userSchema);
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    phonenumber: {
      type: Number,
      required: true,
    },
    petname: {
      type: String,
      required: true,
    },
    pettype: {
      type: String,
      required: true,
    },
    petnickname: {
      type: String,
      required: true,
    },
  });


  // This line creates and exports a Mongoose model named 'user' based on the userSchema,
// allowing you to interact with the 'users' collection in MongoDB (e.g., create, read, update, delete documents).
  export default mongoose.model('user', userSchema);
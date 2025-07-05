import mongoose from 'mongoose'; 

const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI);
//     Connects to the MongoDB database using the connection string stored in the environment variable MONGO_URI.
// `useNewUrlParser` and `useUnifiedTopology` are options to use the latest MongoDB drivers for better connection handling.
    await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
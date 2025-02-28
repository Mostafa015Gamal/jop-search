import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URI)
    .then(() => console.log(`DB connected successfully!`))
    .catch((error) => console.log(`DB Failed to connect ${error.message}`));
};

export default connectDB;

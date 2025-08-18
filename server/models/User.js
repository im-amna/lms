// 1. Import mongoose
import mongoose from "mongoose";

// 2. Define the schema
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Custom ID (e.g., from auth provider)
    name: { type: String, required: true }, // User's name
    email: { type: String, required: true }, // User's email
    imageUrl: { type: String, required: true }, // Profile picture URL
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Course model
        ref: "Course",
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// 3. Create the model
const User = mongoose.model("User", userSchema);

// 4. Export the model
export default User;

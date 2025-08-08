import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js"; // Adjust the path to your User model
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../services/emailService.js";

dotenv.config();

// Initialize the Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    // 1. Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    const isNewUser = !existingUser;

    // 2. Find or create the user in your database
    const user = await User.findOneAndUpdate(
      { email },
      {
        googleId: sub,
        name,
        email,
        $unset: { password: "" },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // 3. Generate a JWT for your application
    const appToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send email conditionally based on whether it's a new user
    if (isNewUser) {
      const subject = "Welcome to Our Website!";
      const htmlContent = `<h1>Hello ${name},</h1><p>Thank you for signing up!</p>`;

      try {
        await sendEmail(email, subject, htmlContent);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    if (!isNewUser) {
      const subject = "Welcome back to Our Website!";
      const htmlContent = `<h1>Hello ${name},</h1><p>You have been logged in. Welcome Back</p>`;

      try {
        await sendEmail(email, subject, htmlContent);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    // 5. Send the JWT and user data back to the frontend
    res.status(200).json({
      message: isNewUser
        ? "Google signup successful"
        : "Google login successful",
      token: appToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

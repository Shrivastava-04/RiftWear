import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js"; // Adjust the path to your User model
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../services/emailService.js";

dotenv.config();

// Initialize the Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);
const frontendUrl = process.env.FRONTEND_URL;

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
    const subject = "Welcome to Rift.";
    const htmlContent = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <p>Hi ${name},</p>
        <p>Welcome to Rift. We're thrilled to have you join our community.</p>
        <p>Your account has been successfully created. You can now explore our collections, save your favorite items to your wishlist, and enjoy a faster, smoother checkout experience on all future orders.</p>
        <p>You can get started by exploring our latest collection.</p>
        <p><a href="${frontendUrl}" style="color: #e89846; text-decoration: none;">Explore Our Latest Collection</a></p>
        <p>Connect with Rift on Instagram to stay updated on new releases, behind-the-scenes, and exclusive offers.</p>
        <p><a href="[YOUR_INSTAGRAM_LINK_HERE]" style="color: #e89846; text-decoration: none;">Follow us on Instagram</a></p>
        <p>Best regards,</p>
        <p><strong>Team Rift.</strong></p>
        <p style="font-size: 0.9em; color: #777;">
          <a href="${frontendUrl}/contact" style="color: #777; text-decoration: none;">Contact Us</a> | <a href="${frontendUrl}/unsubscribe" style="color: #777; text-decoration: none;">Unsubscribe</a>
        </p>
      </div>
    `;
    try {
      await sendEmail(email, subject, htmlContent);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    // if (!isNewUser) {
    //   const subject = "Welcome back to Our Website!";
    //   const htmlContent = `<h1>Hello ${name},</h1><p>You have been logged in. Welcome Back</p>`;

    //   try {
    //     await sendEmail(email, subject, htmlContent);
    //   } catch (emailError) {
    //     console.error("Failed to send welcome email:", emailError);
    //   }
    // }

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

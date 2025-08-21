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
      <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
    <div style="padding: 24px; text-align: center; background-color: #1a1a1a; border-bottom: 1px solid #2e2e2e;">
        <div style="font-size: 28px; font-weight: 800; color: #ffffff;">Rift</div>
    </div>
    <div style="padding: 24px;">
        <p style="font-size: 16px; color: #b0b0b0;">Hi ${name},</p>
        <p style="font-size: 16px; color: #b0b0b0;">This is to confirm your account with Rift is active. We're glad to have you with us.</p>
        <p style="font-size: 16px; color: #b0b0b0;">You're all set to manage your orders and enjoy a streamlined checkout on future purchases.</p>
        <p style="font-size: 16px; color: #b0b0b0;">You can see the current collection here:</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${frontendUrl}" style="display: inline-block; background-color: #e89846; color: #0f0e0e; text-decoration: none; font-weight: 700; font-size: 16px; padding: 12px 24px; border-radius: 6px;">Explore Our Collection</a>
        </div>
        <p style="font-size: 16px; color: #b0b0b0;">Best,</p>
        <p style="margin: 0; font-size: 16px; color: #ffffff;"><strong>Team Rift</strong></p>
    </div>
    <div style="padding: 0 24px 24px;">
        <p style="font-size: 14px; font-style: italic; color: #e89846; margin-top: 20px; padding: 16px; background-color: #2e2e2e; border-radius: 4px;">
            P.S. To ensure you receive our order confirmation emails, please drag this message to your <strong>"Primary"</strong> inbox, if it landed in any other tab (promotion).
        </p>
    </div>
</div>
    `;
    if (isNewUser) {
      try {
        await sendEmail(email, subject, htmlContent);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
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

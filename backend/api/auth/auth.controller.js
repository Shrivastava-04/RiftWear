import User from "../users/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../services/email.services.js";

// --- Setup & Constants ---
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

// --- Reusable Email Template ---
const welcomeEmailTemplate = (name) => `
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
            <a href="${FRONTEND_URL}" style="display: inline-block; background-color: #e89846; color: #0f0e0e; text-decoration: none; font-weight: 700; font-size: 16px; padding: 12px 24px; border-radius: 6px;">Explore Our Collection</a>
        </div>
        <p style="font-size: 16px; color: #b0b0b0;">Best,</p>
        <p style="margin: 0; font-size: 16px; color: #ffffff;"><strong>Team Rift</strong></p>
    </div>
    <div style="padding: 0 24px 24px;">
        <p style="font-size: 14px; font-style: italic; color: #e89846; margin-top: 20px; padding: 16px; background-color: #2e2e2e; border-radius: 4px;">
            P.S. To ensure you receive our order confirmation emails, please drag this message to your <strong>"Primary"</strong> inbox, if it landed in any other tab (promotion).
        </p>
    </div>
</div>`;

const passwordResetEmailTemplate = (userName, resetURL) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #121212; border-radius: 12px; color: #e5e7eb; padding: 32px;">
      <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 24px; margin-bottom: 24px;">
        <h1 style="font-size: 30px; font-weight: 800; color: #ffffff; margin: 0;">Rift</h1>
      </div>
      <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 16px;">Reset Your Password</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">Hi ${
        userName.split(" ")[0]
      },</p>
      <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">We received a request to reset the password for your Rift account. You can reset your password by clicking the button below:</p>
      
      <div style="margin: 32px 0; text-align: center;">
        <a href="${resetURL}" target="_blank" style="background-color: #e89846; color: #121212; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block;">Reset Password</a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #a0a0a0;">This link is only valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
      
      <p style="text-align: center; font-size: 12px; color: #777; margin-top: 32px;">Rift | Student-Run at IIT (ISM) Dhanbad</p>
    </div>
  `;
};

const passwordChangedConfirmationTemplate = (userName) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #121212; border-radius: 12px; color: #e5e7eb; padding: 32px;">
      <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 24px; margin-bottom: 24px;">
        <h1 style="font-size: 30px; font-weight: 800; color: #ffffff; margin: 0;">Rift</h1>
      </div>
      <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 16px;">Security Alert: Your Password Was Changed</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">Hi ${
        userName.split(" ")[0]
      },</p>
      <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0;">This email is a confirmation that the password for your Rift account has been successfully changed. You can now log in with your new credentials.</p>
      
      <div style="margin: 32px 0; text-align: center;">
        <a href="${
          process.env.FRONTEND_URL
        }/login" target="_blank" style="background-color: #e89846; color: #121212; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block;">Login to Your Account</a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #a0a0a0;">If you did not make this change, please contact our support team immediately to secure your account.</p>
      
      <p style="text-align: center; font-size: 12px; color: #777; margin-top: 32px;">Rift | Student-Run at IIT (ISM) Dhanbad</p>
    </div>
  `;
};

// --- Reusable Helper Function ---
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15d" });
  res.cookie("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

// --- Controller Functions ---

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // ... validation logic ...
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Send Welcome Email
    try {
      const subject = `Welcome to Rift, ${name}!`;
      const htmlContent = welcomeEmailTemplate(name);
      await sendEmail(email, subject, htmlContent);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Do not block signup if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error during signup." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // ... login logic ...
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email, and password are required." });
    }
    const user = await User.findOne({ email });
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwtToken", {
    /* ... cookie options ... */
  });
  res.status(200).json({ success: true, message: "Logout successful." });
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const { sub: googleId, email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (isNewUser) {
      user = new User({ googleId, name, email, isVerified: true });
      await user.save();
      // Send Welcome Email only for new Google signups
      try {
        const subject = `Welcome to Rift, ${name}!`;
        const htmlContent = welcomeEmailTemplate(name);
        await sendEmail(email, subject, htmlContent);
      } catch (emailError) {
        console.error(
          "Failed to send Google signup welcome email:",
          emailError
        );
      }
    } else {
      user.googleId = googleId;
      await user.save();
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      message: isNewUser
        ? "Google signup successful"
        : "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Google authentication failed." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always send a success-like response to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with this email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetURL = `${FRONTEND_URL}/reset-password/${resetToken}`;

    const emailHtml = passwordResetEmailTemplate(user.name, resetURL);
    await sendEmail(user.email, "Your Rift Password Reset Link", emailHtml);

    res.status(200).json({
      message:
        "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // =======================================================
    // --- NEW: Send Password Change Confirmation Email ---
    // =======================================================
    try {
      const subject = "Security Alert: Your Rift Password Has Been Changed";
      const htmlContent = passwordChangedConfirmationTemplate(user.name);
      await sendEmail(user.email, subject, htmlContent);
    } catch (emailError) {
      // Log the error, but don't fail the overall request as the password was changed successfully.
      console.error(
        "Failed to send password change confirmation email:",
        emailError
      );
    }
    // =======================================================

    res
      .status(200)
      .json({
        success: true,
        message: "Password has been reset successfully.",
      });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

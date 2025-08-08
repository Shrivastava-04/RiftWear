// src/services/emailService.js
import Brevo from "sib-api-v3-sdk"; // Corrected import
import dotenv from "dotenv";

dotenv.config();

const defaultClient = Brevo.ApiClient.instance;
defaultClient.basePath = "https://api.brevo.com/v3";

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

export const sendEmail = async (to, subject, htmlContent) => {
  const sendSmtpEmail = {
    sender: {
      name: "Harshit Shrivastava",
      email: process.env.BREVO_EMAIL_SENDER,
    },
    to: [{ email: to }],
    subject: subject,
    htmlContent: htmlContent,
  };

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to ${to}. Response:`, response);
    return response;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.body);
    throw error;
  }
};

// backend/send.js

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Simple health check route (optional)
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// POST /send endpoint (no /api prefix)
app.post("/send", async (req, res) => {
  const { name, email, contact, message } = req.body;

  console.log("Request body:", req.body);

  if (!name || !email || !contact) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_RECEIVER,
    subject: `New message from ${name}`,
    text: `Name: ${name}\n\nContact: ${contact}\n\nEmail: ${email}\n\nMessage: ${message || "No message provided"}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

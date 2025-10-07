import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Contact } from "./models/contact.js"; // Adjust path if needed

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// listen and connect to database
app.listen(PORT, () => {
  console.log(`backend is running  at port ${PORT}`);
  mongoose
    .connect(
      "mongodb+srv://mp4624663:mukesh2000@landingpc.qtph946.mongodb.net/LandingpageofCodesbizz"
    )
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((err) => {
      console.log("error in database connection", err);
    });
});

// POST route to handle contact form
app.post("/contact", async (req, res) => {
  console.log("Received contact form data:", req.body);
  const { name, email, number, company, message } = req.body;

  try {
    // Save to MongoDB
    const newContact = new Contact({ name, email, number, company, message });
    await newContact.save();
    console.log("Contact saved to database:", newContact);
    res.send({
      message: "data saved successfully",
      data: newContact,
    });

    // Send email
    let testAccount = await nodemailer.createTestAccount();
    console.log("Test account created:", testAccount);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      // from: "user@gmail.com",
      from: email,
      // to: process.env.EMAIL_USER,
      to: process.env.SMTP_MAIL, // listener email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>Contact Details</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Number:</strong> ${number}</li>
          <li><strong>Company:</strong> ${company}</li>
        </ul>
        <h4>Message:</h4>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("email sent successfully:", mailOptions);

    res
      .status(200)
      .send({
        message: "Message sent and saved successfully",
        data: newContact,
      });
  } catch (error) {
    console.error("❌ Error handling contact form:", error);
    res.status(500).json({ message: "Error processing your request", error });
  }
});

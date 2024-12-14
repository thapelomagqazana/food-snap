const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "../.env" });

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify the connection configuration
// transporter.verify((error, success) => {
//     if (error) {
//         console.error("Email transporter configuration error:", error);
//     } else {
//         console.log("Email transporter is configured successfully:", success);
//     }
// });

module.exports = transporter;

const express = require("express");
const router = new express.Router();
const users = require("../models/userSchema");
const nodemailer = require("nodemailer");
const cors = require("cors");

// Use CORS middleware
router.use(cors());

// email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

//register user details
router.post("/register", async (req, res) => {
    const { fname, lname, email, password, mobile, message } = req.body;

    if (!fname || !lname || !email || !password || !mobile) {
        return res.status(401).json({ status: 401, error: "All Input required" });
    }

    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            const userMessage = await preuser.Messagesave(message);
            console.log(userMessage);
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Sending email using Node.js",
                text: "Your Response Has Been Submitted"
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error" + error);
                } else {
                    console.log("Email sent: " + info.response);
                    return res.status(201).json({ status: 201, message: "Email sent successfully" });
                }
            });
        } else {
            const finalUser = new users({
                fname, lname, email, password, mobile, messages: { message: message }
            });

            const storeData = await finalUser.save();

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Sending email using Node.js",
                text: "Your Response Has Been Submitted"
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error" + error);
                } else {
                    console.log("Email sent: " + info.response);
                    return res.status(201).json({ status: 201, message: "Email sent successfully", storeData });
                }
            });
        }

    } catch (error) {
        res.status(401).json({ status: 401, error: "All Input required" });
        console.log("catch error", error);
    }
});

module.exports = router;



// const express = require("express");
// const router = new express.Router();
// const users = require("../models/userSchema");
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Email config
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASS
//     }
// });

// // Middleware to authenticate token
// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         const user = await users.findOne({ _id: decoded._id, 'tokens.token': token });

//         if (!user) {
//             throw new Error();
//         }

//         req.token = token;
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Please authenticate.' });
//     }
// };

// // Register user
// router.post("/register", async (req, res) => {
//     const { fname, lname, email, password, mobile } = req.body;

//     if (!fname || !lname || !email || !password || !mobile) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     try {
//         const user = new users({ fname, lname, email, password, mobile });
//         const token = await user.generateAuthToken();
//         await user.save();

//         res.status(201).json({ user, token });
//     } catch (error) {
//         res.status(400).json({ error: "User registration failed" });
//     }
// });

// // Login user
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await users.findOne({ email });

//         if (!user) {
//             return res.status(400).json({ error: "Invalid login credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ error: "Invalid login credentials" });
//         }

//         const token = await user.generateAuthToken();

//         res.json({ user, token });
//     } catch (error) {
//         res.status(500).json({ error: "Login failed" });
//     }
// });

// // Authenticated route to handle contact form submission
// router.post("/contact", auth, async (req, res) => {
//     const { message } = req.body;

//     try {
//         const userMessage = await req.user.Messagesave(message);

//         const mailOptions = {
//             from: process.env.EMAIL,
//             to: req.user.email,
//             subject: "Message received",
//             text: "Your message has been received successfully"
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return res.status(500).json({ error: "Email sending failed" });
//             } else {
//                 res.status(201).json({ message: "Message saved and email sent successfully" });
//             }
//         });
//     } catch (error) {
//         res.status(400).json({ error: "Message submission failed" });
//     }
// });

// module.exports = router;

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
        let preuser = await users.findOne({ email: email });

        if (preuser) {
            const userMessage = await preuser.Messagesave(message);
            console.log(userMessage);

            //generating token
            const token = await preuser.generateToken();
            console.log("Preuser Token: ", token);
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

            //generate token
            const token = await storeData.generateToken();
            console.log("newUser Token: ", token);
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

            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         console.log("Email error:", error);
            //         return res.status(500).json({ status: 500, error: "Failed to send email" });
            //     }
            //     console.log("Email sent:", info.response);
            //     // Send the token in the response
            //     res.status(201).json({
            //         status: 201,
            //         message: "Registration successful and email sent",
            //         token: token // Include the token in the response
            //     });
            // });
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
// const cors = require("cors");

// // Use CORS middleware
// router.use(cors());

// // email config
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASS
//     }
// });

// //register user details
// router.post("/register", async (req, res) => {
//     const { fname, lname, email, password, mobile, message } = req.body;

//     if (!fname || !lname || !email || !password || !mobile) {
//         return res.status(400).json({ status: 400, error: "All inputs required" });
//     }

//     try {
//         let user = await users.findOne({ email: email });

//         if (user) {
//             const userMessage = await user.Messagesave(message);
//             console.log(userMessage);
//         } else {
//             user = new users({
//                 fname, lname, email, password, mobile, messages: [{ message }]
//             });
//             await user.save();
//         }

//         // Generate token
//         const token = await user.generateToken(); // Using the method on the user instance
//         console.log("Generated Token:", token);

//         const mailOptions = {
//             from: process.env.EMAIL,
//             to: email,
//             subject: "Registration Confirmation",
//             text: "Your Response Has Been Submitted"
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log("Email error:", error);
//                 return res.status(500).json({ status: 500, error: "Failed to send email" });
//             }
//             console.log("Email sent:", info.response);
//             res.status(201).json({
//                 status: 201,
//                 message: "Registration successful and email sent",
//                 token: token // Include the token in the response
//             });
//         });

//     } catch (error) {
//         console.log("Registration error:", error);
//         res.status(500).json({ status: 500, error: "Registration failed" });
//     }
// });

// module.exports = router;
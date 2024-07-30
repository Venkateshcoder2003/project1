const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const validator = require('validator');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        //required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        //unique: true,
    },
    messages: []
})


//hashing password
userSchema.pre("save", async function (next) {
    const user = this;
    if (!this.isModified("password")) {
        next();
    }
    try {
        const hashPassword = await bcrypt.hash(this.password, 10);
        this.password = hashPassword;
    } catch (error) {
        next(error)
    }
    console.log(this);
});
//JWt Authentication

//save message
userSchema.methods.Messagesave = async function (message) {
    try {
        this.messages = this.messages.concat({ message });
        await this.save();
        return message;
    } catch (error) {
        console.log(error)
    }
}

//authenticating user
// userSchema.methods.generateAuthToken = async function () {
//     try {
//         const user = this;
//         const token = jwt.sign(
//             { _id: user._id.toString() },
//             process.env.JWT_SECRET,
//             { expiresIn: "1m" }
//         );
//         await user.save();
//         return token;
//     } catch (error) {
//         console.log(error);
//     }
// }
//createing model
const users = new mongoose.model("users", userSchema);


module.exports = users;



// const mongoose = require('mongoose');
// const bcrypt = require("bcryptjs");
// const validator = require('validator');
// const jwt = require('jsonwebtoken');

// const userSchema = new mongoose.Schema({
//     fname: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     lname: {
//         type: String,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error("invalid email")
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     mobile: {
//         type: String,
//         required: true,
//     },
//     messages: [],
//     tokens: [{
//         token: {
//             type: String,
//             required: true
//         }
//     }]
// });

// // Hashing password
// userSchema.pre("save", async function (next) {
//     const user = this;
//     if (!this.isModified("password")) {
//         next();
//     }
//     try {
//         const hashPassword = await bcrypt.hash(this.password, 10);
//         this.password = hashPassword;
//     } catch (error) {
//         next(error)
//     }
// });

// // JWT Authentication
// userSchema.methods.generateAuthToken = async function () {
//     try {
//         const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, { expiresIn: "7d" });
//         this.tokens = this.tokens.concat({ token });
//         await this.save();
//         return token;
//     } catch (error) {
//         console.log(error);
//     }
// };

// // Saving message
// userSchema.methods.Messagesave = async function (message) {
//     try {
//         this.messages = this.messages.concat({ message });
//         await this.save();
//         return message;
//     } catch (error) {
//         console.log(error);
//     }
// };

// // Creating model
// const users = new mongoose.model("users", userSchema);

// module.exports = users;

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const validator = require('validator');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
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
        //instead of concat we can also use push
        await this.save();
        return message;
    } catch (error) {
        console.log(error)
        //we can also use throw error for clarity
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

//Thapa Technical auth

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            //payload
            {
                userId: this._id.toString(),
                email: this.email
            },
            //signature(JWT Secrete key in .env file)
            process.env.JWT_SECRET,
            {
                expiresIn: "30d"
            }
        )

    } catch (error) {
        console.log(error)
        throw error;

    }
}


//createing model
const users = new mongoose.model("user", userSchema);


module.exports = users;



const jwt = require('jsonwebtoken')
const data = require('../database/sample_data.js')
const Messages = require("../models/messageModel");


module.exports.login = async (req,res) => {
   
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            message: "All fields are mandatory"
        });
    }

    const user = data.users.find(user => user.email === email);

    if (!user) {
        return res.status(409).json({
            status: 409,
            message: "Email Id not registered"
        });
    }

    if (!user.password) {
        return res.status(400).send({ message: "Don't have Password" });
    }

    if (password !== user.password) {
        return res.status(400).send({ message: "Password does not Match" });
    }

    // create jwt token
    const token = jwt.sign({
        userId: user._id,
        email : user.email
    }, process.env.JWT_SECRET , { expiresIn : "24h"});

    return res.status(200).send({
        msg: "Login Successful...!",
        email: user.email,
        token
    });
    
}
// Add prompt function
module.exports.addPrompt = async (req, res, next) => {
    try {
        const { email, prompt, answer } = req.body;
        console.log(req.body)
        const data = await Messages.create({
            email: email,
            prompt: prompt,
            answer: answer,
        });

        if (data) return res.json({ msg: "Prompt added successfully." });
        else return res.json({ msg: "Failed to add prompt to the database" });
    } catch (ex) {
        next(ex);
    }
};

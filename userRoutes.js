const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existing_User = await User.findOne({ where: { email } });

        if (existing_User) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await User.create({ name, email, password });

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

module.exports = router;

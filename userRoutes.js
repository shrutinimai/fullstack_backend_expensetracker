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

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

module.exports = router;

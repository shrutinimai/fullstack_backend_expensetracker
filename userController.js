const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};

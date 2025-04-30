const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const externalCustomerId = "user_" + Math.random().toString(36).substring(2, 9);


        const newUser = await User.create({ name, email, password: hashedPassword,externalCustomerId });

        console.log("User created:", newUser.toJSON());

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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRY });

        await user.update({ refreshToken });

        res.status(200).json({ message: "Login successful", token, refreshToken,externalCustomerId: user.externalCustomerId });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};

exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const existingUser = await User.findByPk(user.id); 

            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            if (existingUser.refreshToken !== refreshToken) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const newToken = jwt.sign(
                { id: existingUser.id },  
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY }
            );

            res.status(200).json({ token: newToken });
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Failed to refresh token" });
    }
};

exports.updateExternalCustomerId = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const externalCustomerId = "user_" + Math.random().toString(36).substring(2, 9);
        user.externalCustomerId = externalCustomerId;
        await user.save();

        res.status(200).json({ message: "externalCustomerId updated successfully", externalCustomerId });
    } catch (error) {
        console.error("Error updating externalCustomerId:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Add this in your user controller
exports. getUserProfile = async (req, res) => {
    

    try {
        const user = await User.findByPk(req.user.id); // assuming you have user info from JWT

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            isPremiumUser: user.isPremiumUser,  // send the premium status
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
};


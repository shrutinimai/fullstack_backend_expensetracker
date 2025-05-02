const jwt = require("jsonwebtoken");
require("dotenv").config();  
const User = require("../models/User");

module.exports = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        console.log("Decoded Token:", decoded);

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;  
        next();  

    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
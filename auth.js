const Userauth = require("../models/User");  
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, "your_secret_key");

        const user = await Userauth.findByPk(decoded.id);  

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

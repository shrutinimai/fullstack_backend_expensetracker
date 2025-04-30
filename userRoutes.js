const express = require("express");
const router = express.Router();
const { signup, login,refresh,getUserProfile } = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);

router.post("/refresh", refresh);
// Add this route in your userRoutes.js
router.get("/profile",getUserProfile); // assuming 'auth' middleware protects this route

module.exports = router;

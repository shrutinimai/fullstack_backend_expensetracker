const express = require("express");
const router = express.Router();
const { signup, login,refresh,getUserProfile,getLeaderboard } = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);

router.post("/refresh", refresh);
router.get("/profile",getUserProfile); 

router.get("/leaderboard",auth,  getLeaderboard);  // Route to fetch leaderboard



module.exports = router;

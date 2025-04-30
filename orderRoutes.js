const express = require("express");
const { createOrder, updateOrderStatus, handleCashfreeWebhook ,orderSuccessHandler,} = require("../controllers/orderController");
const auth = require("../middleware/auth");  

const router = express.Router();


router.post("/create", auth,createOrder);



router.post("/update", auth,updateOrderStatus);



router.post("/webhook", handleCashfreeWebhook);
router.get("/success", orderSuccessHandler);  // ✅ new route for return_url


// ✅ Add this to your Express router (e.g., in routes/order.js)
//router.post('/update-status', orderController.updateOrderStatus);


module.exports = router;

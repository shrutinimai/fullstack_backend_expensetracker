const express = require("express");
 const { createOrder, updateOrderStatus, handleCashfreeWebhook ,orderSuccessHandler,} = require("../controllers/orderController");
 const auth = require("../middleware/auth");  
 
 const router = express.Router();
 
 
 router.post("/create", auth,createOrder);
 
 
 
 router.post("/update", auth,updateOrderStatus);
 
 
 
 router.post("/webhook", handleCashfreeWebhook);
 router.get("/success", orderSuccessHandler);  
 
 
 
 
 module.exports = router;
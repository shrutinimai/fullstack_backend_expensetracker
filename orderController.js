const axios = require('axios');
const Order = require('../models/OrderTemp');  
const User = require('../models/User');  
const crypto = require('crypto'); // For verifying webhook signatures

const createOrder = async (req, res) => {
    const { orderAmount, customerId, customerPhone, orderCurrency = 'INR' } = req.body;

    if (!orderAmount || !customerId || !customerPhone) {
        return res.status(400).json({ message: "Missing required fields!" });
    }

    try {
        const user = await User.findOne({ where: { externalCustomerId: customerId } });

        if (!user) {
            return res.status(404).json({ message: "User not found for this customer ID" });
        }

        const orderData = {
            order_currency: orderCurrency,
            order_amount: orderAmount,
            customer_details: {
                customer_id: customerId,
                customer_phone: customerPhone,
            },
            order_meta: {
                return_url: `http://localhost:5500/expense.html?order_id={order_id}`
            }
        
        };
        console.log("Sending request to Cashfree with data:", orderData); 

        const response = await axios.post('https://sandbox.cashfree.com/pg/orders', orderData, {
            headers: {
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
                'Content-Type': 'application/json'
            }
        });
        console.log("Cashfree Response:", response.data);

        const { payment_session_id, order_id } = response.data;
        if (!payment_session_id || !order_id) {
            return res.status(500).json({ message: "Failed to create payment session." });
        }

        const order = await Order.createOrder(order_id, orderAmount, user.id);

        await order.update({ paymentId: payment_session_id, customerPhone });

        res.status(200).json({ payment_session_id, order_id });

    } catch (error) {
        console.error("Error creating order:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to create payment session" });
    }
};


const verifyPaymentWithCashfree = async (orderId) => {
    try {
        const response = await axios.get(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
            headers: {
                'x-api-version': '2023-08-01',
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET
            }
        });
        const status = response.data.order_status;
        return status;
        //return response.data.order_status === 'PAID';
    } catch (error) {
        console.error("Error verifying order with Cashfree:", error.response?.data || error.message);
        return false;
    }
};


const orderSuccessHandler = async (req, res) => {
    const { order_id } = req.query;
    if (!order_id) return res.status(400).send("Missing order ID");

    try {
        const status = await verifyPaymentWithCashfree(order_id);
        if (!status || status !== 'PAID') return res.status(400).send("Payment not successful");

        const order = await Order.findOne({ where: { orderId: order_id } });
        if (!order) return res.status(404).send("Order not found");

       // await Order.updateStatus(order_id, 'SUCCESSFUL', order.paymentId); // ✅ Already correct usage
       order.status = 'SUCCESSFUL';
       await order.save();

        const user = await User.findByPk(order.userId);
        if (user) {
            user.isPremiumUser = 'YES';
            await user.save();
        }

        res.status(200).send("✅ Payment Successful. Premium Activated.");
    } catch (error) {
        console.error("Order success handler error:", error);
        res.status(500).send("Server error");
    }
};



const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
        return res.status(400).json({ message: "Missing required fields!" });
    }



    try {
        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

      order.status = status;
        await order.save();

       const user = await User.findByPk(order.userId);
       if (user) {
        if (status === 'SUCCESSFUL') {
            user.isPremiumUser = 'YES';  // Set to YES if successful
        } else {
            user.isPremiumUser = 'NO';   // Set to NO if payment failed
        }
        await user.save();
    }

        res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
};



const handleCashfreeWebhook = async (req, res) => {
    const { orderId, orderStatus, signature } = req.body;

    if (!orderId || !orderStatus || !signature) {
        return res.status(400).json({ message: "Missing required fields!" });
    }

    try {
        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const isValidSignature = verifyCashfreeSignature(signature, orderId, orderStatus);
        if (!isValidSignature) {
            return res.status(400).json({ message: "Invalid signature!" });
        }

        //order.status = orderStatus;
        await Order.updateStatus(orderId, orderStatus, order.paymentId);

        const user = await User.findByPk(order.userId);
        if (user) {
            if (orderStatus === 'SUCCESSFUL') {
                user.isPremiumUser = 'YES';  // Set to YES if payment is successful
            } else {
                user.isPremiumUser = 'NO';   // Set to NO if payment failed
            }
            await user.save();
        }

       // await order.save();

        res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

const verifyCashfreeSignature = (signature, orderId, orderStatus) => {
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    const data = `${orderId}|${orderStatus}`;
    const generatedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(data)
        .digest('hex');

    return signature === generatedSignature;
};




module.exports = { 
    createOrder,
    updateOrderStatus,
    orderSuccessHandler,
    handleCashfreeWebhook,
    verifyPaymentWithCashfree
};

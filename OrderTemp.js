const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    orderAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SUCCESSFUL', 'FAILED'),
        defaultValue: "PENDING"
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
}, {
    tableName: "orders", 
    timestamps: true
});

Order.createOrder = async function(orderId,orderAmount, userId) {
    return await Order.create(
        { orderId,
          userId,
          orderAmount,
          status: 'PENDING'


         });
};

Order.updateStatus = async function(orderId, status, paymentId) {
    return await Order.update(
        { status, paymentId },
        { where: { orderId } }
    );
};

Order.findByOrderId = async function(orderId) {
    return await Order.findOne({ where: { orderId } });
};

module.exports = Order;

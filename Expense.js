const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Expense = sequelize.define("expenses", {
    money: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Expense;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

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
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

});
Expense.belongsTo(User, { foreignKey: "userId" });  
User.hasMany(Expense, { foreignKey: "userId" });    

module.exports = Expense;

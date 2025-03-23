const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync()
    .then(() => console.log("User table created"))
    .catch((err) => console.error("Error:", err));

module.exports = User;

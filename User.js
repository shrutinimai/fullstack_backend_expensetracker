const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isPremiumUser: {
        type: DataTypes.STRING,
        defaultValue: "No",
    },
    total_expenses: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    externalCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      refreshToken: {  
        type: DataTypes.TEXT,
        allowNull: true,
    }

      
}, {
    tableName: "Users",
    timestamps: true,
});

User.findByEmail = async function(email) {
    return await User.findOne({ where: { email } });
};

User.findById = async function(id) {
    return await User.findOne({ where: { id } });
};

module.exports = User;

const { Sequelize,DataTypes } = require("sequelize");
 const sequelize = require("../config/db");
 const User = require("./User");

const Expense = sequelize.define("Expense", {
     id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true
 },

    
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
    allowNull: false,
    references: {
        model: User,
        key: "id"
    },
    onDelete: "CASCADE" 
},
created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
}
       
    
}, {
    tableName: "expenses",
    timestamps: false
});

Expense.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Expense, { foreignKey: "userId" });

module.exports = Expense;





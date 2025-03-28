const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const User = require("./models/User");  
const Expense = require("./models/Expense");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

sequelize
    .sync({ alter: true })   
    .then(() => {
        console.log("Database synced!");
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch((err) => console.error("Error syncing DB:", err));


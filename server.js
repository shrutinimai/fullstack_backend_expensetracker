require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
const sequelize = require("./config/db");

require("./models/User");
require("./models/Expense");
require("./models/OrderTemp");


const expenseRoutes = require("./routes/expenseRoutes");

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");


const app = express();
app.use(cors());
app.use(bodyParser.json());




app.use("/expense", expenseRoutes); 
app.use("/user", userRoutes);  
app.use("/order", orderRoutes);  

app.get("/", (req, res) => {
    res.send(" Expense Tracker API is Running!");
});

sequelize.sync()
    .then(() => {
        console.log("Database synced successfully.");
        const PORT = process.env.PORT || 4200;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });

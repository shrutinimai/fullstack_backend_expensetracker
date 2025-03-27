const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);

sequelize.sync().then(() => {
    console.log("Database connected!");
    app.listen(3000, () => console.log("Server running on port 3000"));
}).catch((error) => {
    console.error("Failed to sync database:", error);
});

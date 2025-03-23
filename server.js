const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => console.error("Error:", err));

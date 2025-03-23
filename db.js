const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expense", "root", "root", {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate()
    .then(() => console.log("Connected to MySQL"))
    .catch((err) => console.error("Error:", err));

module.exports = sequelize;

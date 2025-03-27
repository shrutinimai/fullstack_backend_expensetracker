const Expense = require("../models/expense");

exports.addExpense = async (req, res) => {
    try {
        console.log("Request received:", req.body);  
        const { money, description, category } = req.body;
        const newExpense = await Expense.create({ money, description, category });
        console.log("Expense added:", newExpense);  

        res.status(201).json(newExpense);

    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Failed to add expense" });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expenses" });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.destroy({ where: { id } });
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense" });
    }
};

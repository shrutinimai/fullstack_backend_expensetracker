const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    try {
        console.log("Request received:", req.body);  
        const { money, description, category } = req.body;
        const newExpense = await Expense.create(
            { 
                money,
                 description,
                  category,
                  userId: req.user.id 
                 }
                );
        console.log("Expense added:", newExpense);  

        res.status(201).json(newExpense);

    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Failed to add expense" });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.id }
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expenses" });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findByPk(id);

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (expense.userId !== req.user.id) {   
            return res.status(403).json({ message: "Unauthorized" });
        }

        await expense.destroy();
        res.status(200).json({ message: "Expense deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Expense = require("../models/Expense");
const User = require("../models/User"); 
exports.addExpense = async (req, res) => {
    try {
        console.log("request received:", req.body);

        if (!req.user || !req.user.id) {  
            console.error("No user found in request!");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { money, description, category } = req.body;

        const newExpense = await Expense.create({
            money,
            description,
            category,
            userId: req.user.id,  
        });

        const user = await User.findByPk(req.user.id);
    user.total_expenses = parseFloat(user.total_expenses) + parseFloat(money); 
    await user.save(); 

        console.log("Expense Added:", newExpense);
        res.status(201).json(newExpense);

    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Failed to add expense", error: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.id }
        });
        const user = await User.findByPk(req.user.id);  

        res.status(200).json({
           expenses,
           isPremiumUser: user ? user.isPremiumUser : 'NO'

        });
        } catch (error) {
            console.error("Error fetching expenses:", error);

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

        const user = await User.findByPk(req.user.id);
        user.total_expenses = parseFloat(user.total_expenses) - parseFloat(money); // <-- Subtract expense
        await user.save();
    
        await expense.destroy();
        res.status(200).json({ message: "Expense deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense", error: error.message });
    }
};

const Expense = require("../models/Expense");
const { Op } = require("sequelize");  // Import Sequelize operators for filtering
const { predictExpenses } = require("../utils/mlModel"); // Your ML model prediction function

// Get Predicted Expenses
exports.getExpensePrediction = async (req, res) => {
  try {
    const { month } = req.query;

    // Validate the month input
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    // Fetch past expenses data from the database for the current user
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,
        // Assuming your `Expense` model has a `date` field that stores the date of the expense
        date: {
          [Op.startsWith]: month, // Filter by month, e.g., "2025-03"
        },
      },
    });

    if (expenses.length === 0) {
      return res.status(400).json({ error: "No expenses data available for the given month" });
    }

    // Convert the expenses data into a usable format for the ML model
    const formattedExpenses = expenses.map((exp) => ({
      category: exp.category,
      amount: exp.amount,
      date: exp.date,
    }));

    // Use ML model to predict future expenses based on past data
    const predictions = await predictExpenses(formattedExpenses, month); // Pass formatted data to ML model

    // Ensure predictions contain the expected data
    if (!predictions || !predictions.predictedExpenses) {
      return res.status(500).json({ error: "Prediction failed, no predicted data received" });
    }

    // Return the predictions with the forecasted amounts
    res.status(200).json({ predictions: predictions.predictedExpenses });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "An error occurred while processing the prediction request" });
  }
};

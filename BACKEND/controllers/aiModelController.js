const axios = require("axios");
// Categorize expense description
const categorizeExpense = async (req, res) => {
  try {
      const { description } = req.body;
      if (!description) {
          return res.status(400).json({ error: "Description is required" });
      }

      const response = await axios.post(`http://127.0.0.1:5000/api/v1/predict-category`, {
        description,
    });

      res.status(200).json(response.data);
  } catch (error) {
      console.error("Categorization error:", error);
      res.status(500).json({ error: "Failed to categorize expense" });
  }
};

// Get predicted future expenses
const getExpensePrediction = async (req, res) => {
    try {
        const { month } = req.query;
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        const response = await axios.get(`http://127.0.0.1:5000/api/v1/forecast-expense`, {
            // params: { userId: req.user.id, month },
            params: { month },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Expense prediction error:", error);
        res.status(500).json({ error: "Failed to predict expenses" });
    }
};

// Get goal achievement prediction
const getGoalPrediction = async (req, res) => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/api/v1/predict-goal-achievement`, {
            params: { userId: req.user.id },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Goal prediction error:", error);
        res.status(500).json({ error: "Failed to predict goal achievement" });
    }
};

// Get AI-based budget recommendation
const getBudgetRecommendation = async (req, res) => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/api/v1/recommend-budget`, {
            params: { userId: req.user.id },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Budget recommendation error:", error);
        res.status(500).json({ error: "Failed to get budget recommendation" });
    }
};

module.exports = {
    getExpensePrediction,
    getGoalPrediction,
    getBudgetRecommendation,
    categorizeExpense,
};

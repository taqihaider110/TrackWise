// D:\ai-finance-tracker\backend\utils\mlModel.js

// Simulated function for predicting expenses (replace with real ML model logic)
const predictExpenses = (expenses, month) => {
  // This is a dummy prediction for now
  return {
    predictedExpenses: [
      { category: "Food", amount: 200 },
      { category: "Rent", amount: 800 },
      { category: "Entertainment", amount: 150 },
    ],
    message: `Predictions for ${month}`,
  };
};

module.exports = { predictExpenses };

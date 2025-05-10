const cron = require("node-cron");
const { Op } = require("sequelize");
const SavingsProgress = require("./models/SavingsProgress");
const Goal = require("./models/Goal");
const { sequelize } = require("./models"); // Assuming your Sequelize instance is exported from models/index.js

async function updateMonthlySavingsProgress() {
  try {
    const goals = await Goal.findAll({
      where: { userId: { [Op.ne]: null } },
    });

    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of this month
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of this month

    for (let goal of goals) {
      const totalSavedInMonth = await SavingsProgress.sum('amountSaved', {
        where: {
          goalId: goal.id,
          progressDate: {
            [Op.between]: [monthStart, monthEnd],
          },
        },
      });

      // Check if savings progress already exists for the current month
      const existingProgress = await SavingsProgress.findOne({
        where: {
          goalId: goal.id,
          progressDate: {
            [Op.gte]: monthStart,
            [Op.lt]: monthEnd,
          },
        },
      });

      if (existingProgress) {
        // If exists, update the existing entry (or add total savings if needed)
        existingProgress.amountSaved = totalSavedInMonth;
        await existingProgress.save();
      } else {
        // If no entry exists, create a new one
        await SavingsProgress.create({
          goalId: goal.id,
          userId: goal.userId,
          amountSaved: totalSavedInMonth,
          progressDate: monthEnd, // Save the progress at the end of the month
          description: "Monthly savings progress",
        });
      }
    }

    console.log("Monthly savings progress updated successfully");
  } catch (error) {
    console.error("Error updating monthly savings progress:", error);
  }
}

// Schedule the task to run at the end of every month (23:59 on the last day of the month)
cron.schedule('59 23 28-31 * *', async () => {
  const date = new Date();
  // Run the task only on the last day of the month
  if (date.getDate() === new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
    console.log("Running monthly savings update...");
    await updateMonthlySavingsProgress();
  }
});

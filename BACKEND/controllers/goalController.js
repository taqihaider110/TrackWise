const Goal = require("../models/Goal");
const { Op } = require("sequelize");

// Create Goal (Create a new goal)
exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, description } = req.body;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Validate the input
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newGoal = await Goal.create({
      title,
      targetAmount,
      deadline,
      description,
      userId: req.user.id, // User ID associated with the goal
    });

    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all Goals (With optional filtering, sorting, and pagination)
exports.getGoals = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sortBy = 'deadline', sortOrder = 'ASC' } = req.query;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    // Fetch paginated and sorted goals
    const goals = await Goal.findAll({
      where: { userId: req.user.id },
      limit: parsedPageSize,
      offset,
      order: [[sortBy, sortOrder]], // Sorting by a parameter (default: deadline)
    });

    // Get total count for pagination metadata
    const totalCount = await Goal.count({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      goals,
      pagination: {
        totalRecords: totalCount,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalPages: Math.ceil(totalCount / parsedPageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get a Single Goal by ID (Get a specific goal by its ID)
exports.getGoalById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const goal = await Goal.findOne({
      where: { id, userId: req.user.id },
    });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update Goal (Update an existing goal)
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, deadline, description } = req.body;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const goal = await Goal.findOne({ where: { id, userId: req.user.id } });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }

    // Update the goal details
    goal.title = title || goal.title;
    goal.targetAmount = targetAmount || goal.targetAmount;
    goal.deadline = deadline || goal.deadline;
    goal.description = description || goal.description;

    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete Goal (Delete a specific goal)
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const goal = await Goal.findOne({
      where: { id, userId: req.user.id },
    });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }

    await goal.destroy();

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(400).json({ error: error.message });
  }
};

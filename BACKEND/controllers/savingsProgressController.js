const SavingsProgress = require("../models/SavingsProgress");
const { Op } = require("sequelize");

// Create Savings Progress (Create a new savings progress entry)
exports.createSavingsProgress = async (req, res) => {
  try {
    const { goalId, amountSaved, progressDate, description } = req.body;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Validate the input
    if (!goalId || !amountSaved || !progressDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSavingsProgress = await SavingsProgress.create({
      goalId,
      amountSaved,
      progressDate,
      description,
      userId: req.user.id, // User ID associated with the savings progress
    });

    res.status(201).json(newSavingsProgress);
  } catch (error) {
    console.error("Error creating savings progress:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all Savings Progress (with optional filters)
exports.getSavingsProgress = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sortBy = 'progressDate', sortOrder = 'ASC' } = req.query;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    const savingsProgress = await SavingsProgress.findAll({
      where: { userId: req.user.id },
      limit: parsedPageSize,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const totalCount = await SavingsProgress.count({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      savingsProgress,
      pagination: {
        totalRecords: totalCount,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalPages: Math.ceil(totalCount / parsedPageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching savings progress:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get a specific Savings Progress by ID
exports.getSavingsProgressById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const progress = await SavingsProgress.findOne({
      where: { id, userId: req.user.id },
    });

    if (!progress) {
      return res.status(404).json({ error: "Savings progress not found" });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching savings progress:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update Savings Progress
exports.updateSavingsProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { goalId, amountSaved, progressDate, description } = req.body;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const progress = await SavingsProgress.findOne({
      where: { id, userId: req.user.id },
    });

    if (!progress) {
      return res.status(404).json({ error: "Savings progress not found" });
    }

    progress.goalId = goalId || progress.goalId;
    progress.amountSaved = amountSaved || progress.amountSaved;
    progress.progressDate = progressDate || progress.progressDate;
    progress.description = description || progress.description;

    await progress.save();

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error updating savings progress:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete Savings Progress
exports.deleteSavingsProgress = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const progress = await SavingsProgress.findOne({
      where: { id, userId: req.user.id },
    });

    if (!progress) {
      return res.status(404).json({ error: "Savings progress not found" });
    }

    await progress.destroy();

    res.status(200).json({ message: "Savings progress deleted successfully" });
  } catch (error) {
    console.error("Error deleting savings progress:", error);
    res.status(400).json({ error: error.message });
  }
};

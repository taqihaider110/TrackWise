const Profile = require("../models/Profile");

// Create or Update Profile
exports.saveProfile = async (req, res) => {
  try {
    const { name, gender, dob, initialIncome, initialExpense } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const [profile, created] = await Profile.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        name,
        gender,
        dob,
        initialIncome,
        initialExpense,
        userId: req.user.id,
      },
    });

    if (!created) {
      profile.name = name;
      profile.gender = gender;
      profile.dob = dob;
      profile.initialIncome = initialIncome;
      profile.initialExpense = initialExpense;
      await profile.save();
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(400).json({ error: error.message });
  }
};

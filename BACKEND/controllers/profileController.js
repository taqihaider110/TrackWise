const Profile = require("../models/Profile");

// Create or Update Profile
exports.saveProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const {
      full_name,
      gender,
      dob,
      initialIncome,
      initialExpense,
      firstname,
      lastname,
      phone_no,
      country,
      state,
      city,
      full_address,
    } = req.body;

    const [profile, created] = await Profile.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        full_name,
        gender,
        dob,
        initialIncome,
        initialExpense,
        firstname,
        lastname,
        phone_no,
        country,
        state,
        city,
        full_address,
        userId: req.user.id,
      },
    });

    if (!created) {
      // Update profile fields if it already exists
      profile.full_name = full_name;
      profile.gender = gender;
      profile.dob = dob;
      profile.initialIncome = initialIncome;
      profile.initialExpense = initialExpense;
      profile.firstname = firstname;
      profile.lastname = lastname;
      profile.phone_no = phone_no;
      profile.country = country;
      profile.state = state;
      profile.city = city;
      profile.full_address = full_address;
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
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
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

exports.createBaseProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const {
      full_name,
      gender,
      dob,
      initialIncome,
      initialExpense,
      firstname,
      lastname,
      phone_no,
    } = req.body;

    // Check if each required field is provided
    if (!full_name) {
      return res.status(400).json({ error: "Full name is required" });
    }
    if (!gender) {
      return res.status(400).json({ error: "Gender is required" });
    }
    if (!dob) {
      return res.status(400).json({ error: "Date of birth is required" });
    }
    if (initialIncome === undefined || initialIncome === null) {
      return res.status(400).json({ error: "Initial income is required" });
    }
    if (initialExpense === undefined || initialExpense === null) {
      return res.status(400).json({ error: "Initial expense is required" });
    }
    if (!firstname) {
      return res.status(400).json({ error: "First name is required" });
    }
    if (!lastname) {
      return res.status(400).json({ error: "Last name is required" });
    }
    if (!phone_no) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Attempt to find an existing profile
    const [profile, created] = await Profile.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        full_name,
        gender,
        dob,
        initialIncome,
        initialExpense,
        firstname,
        lastname,
        phone_no,
        userId: req.user.id,
      },
    });

    // If profile already exists (not created), return an error stating it can't be updated
    if (!created) {
      return res
        .status(400)
        .json({ error: "Base profile already exists and cannot be updated." });
    }

    // If profile is created, return the profile
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error("Error saving base profile:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBaseProfileFields = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      attributes: [
        "full_name",
        "gender",
        "dob",
        "initialIncome",
        "initialExpense",
        "firstname",
        "lastname",
        "phone_no",
      ],
    });

    if (!profile) {
      return res.status(404).json({ error: "Base profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching base profile:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create or Update Optional Profile Fields
exports.saveOrUpdateOptionalProfileDetails = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const { country, state, city, full_address } = req.body;

    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res
        .status(404)
        .json({
          error: "Profile not found. Please create base profile first.",
        });
    }

    // Update only provided fields
    if (country !== undefined) profile.country = country;
    if (state !== undefined) profile.state = state;
    if (city !== undefined) profile.city = city;
    if (full_address !== undefined) profile.full_address = full_address;

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating profile details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOptionalProfileFields = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      attributes: ["country", "state", "city", "full_address"],
    });

    if (!profile) {
      return res
        .status(404)
        .json({ error: "Optional profile details not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching optional profile:", error);
    res.status(500).json({ error: error.message });
  }
};

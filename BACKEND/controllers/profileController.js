const Profile = require("../models/Profile");
const User = require("../models/User");

// Create or Update Profile
exports.registerProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const {
      firstname,
      lastname,
      dob,
      phone_no,
      country,
      state,
      city,
      full_address,
    } = req.body;

    const [profile, created] = await Profile.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        firstname,
        lastname,
        dob,
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
      profile.firstname = firstname;
      profile.lastname = lastname;
      profile.dob = dob;
      profile.phone_no = phone_no;
      profile.country = country;
      profile.state = state;
      profile.city = city;
      profile.full_address = full_address;
      await profile.save();

      await User.update(
        { username, email },
        { where: { id: req.user.id } }
      );
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['username', 'email'],
    });

    const response = {
      ...profile.toJSON(),
      username: user?.username,
      email: user?.email,
    };

    res.status(200).json(response);
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
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ['username', 'email'],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Include username and email (not part of the profile, but retrieved from the User model)
    const user = await User.findByPk(req.user.id);

      res.status(200).json({
      id: profile.id,
      userId: profile.userId,
      username: user?.username,
      email: user?.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      dob: profile.dob,
      phone_no: profile.phone_no,
      country: profile.country,
      state: profile.state,
      city: profile.city,
      full_address: profile.full_address,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get Base Profile (non-nullable fields)
exports.createBaseProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const { firstname, lastname, dob, phone_no } = req.body;

    // Validate required fields
    if (!firstname) return res.status(400).json({ error: "First name is required" });
    if (!lastname) return res.status(400).json({ error: "Last name is required" });
    if (!dob) return res.status(400).json({ error: "Date of birth is required" });
    if (!phone_no) return res.status(400).json({ error: "Phone number is required" });

    // Create or find profile
    const [profile, created] = await Profile.findOrCreate({
      where: { userId: req.user.id },
      defaults: {
        userId: req.user.id,
        firstname,
        lastname,
        dob,
        phone_no,
      },
    });

    if (!created) {
      return res
        .status(400)
        .json({ error: "Base profile already exists and cannot be updated." });
    }

    // Send response
    res.status(201).json({
      message: "Profile created successfully",
      profile: {
        id: profile.id,
        firstname: profile.firstname,
        lastname: profile.lastname,
        dob: profile.dob,
        phone_no: profile.phone_no,
      },
    });
  } catch (error) {
    console.error("Error saving base profile:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getBaseProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      attributes: [
        "firstname",
        "lastname",
        "dob",
        "phone_no",
      ],
    });

    if (!profile) {
      return res.status(404).json({ error: "Base profile not found" });
    }

    // Include username and email (not part of the profile, but retrieved from the User model)
    const user = await User.findByPk(req.user.id);

    // Send response with profile details and username/email
    res.status(200).json({
      firstname: profile.firstname,
      lastname: profile.lastname,
      dob: profile.dob,
      phone_no: profile.phone_no,
      username: user?.username,
      email: user?.email,
    });
  } catch (error) {
    console.error("Error fetching base profile:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create or Update Optional Profile Fields
exports.saveOrUpdateProfileAddress = async (req, res) => {
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

    res.status(201).json({
      message: "Profile address updated successfully",
      Profile: {
        id: profile.id,
        country: profile.country,
        state: profile.state,
        city: profile.city,
        full_address: profile.full_address,
      },
    });
  } catch (error) {
    console.error("Error updating profile details:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProfileAddress = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      attributes: ["country", "state", "city", "full_address"],
    });

    if (!profile) {
      return res.status(404).json({ error: "Optional profile details not found" });
    }
    res.status(200).json({
      country: profile.country,
      state: profile.state,
      city: profile.city,
      full_address: profile.full_address,
    });
  } catch (error) {
    console.error("Error fetching optional profile:", error);
    res.status(500).json({ error: error.message });
  }
};

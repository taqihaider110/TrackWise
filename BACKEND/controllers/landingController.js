// controllers/landingController.js

// Handle landing page information
exports.getLandingInfo = async (req, res) => {
    try {
      // Ensure the userId is available from the authenticated user
      // if (!req.user || !req.user.id) {
      //   return res.status(400).json({ error: "User ID is missing" });
      // }
  
      // Static response for the landing page
      const landingInfo = {
        message: "Welcome to AI-Driven Personal Finance Tracker!",
        features: [
          "Track income and expenses",
          "AI-based budget planning",
          "Future expense predictions",
        ],
        about: "Built to help you manage and forecast your finances with smart insights.",
        contact: "support@aifinanceapp.com",
      };
  
      res.status(200).json(landingInfo);
    } catch (error) {
      console.error("Error fetching landing info:", error);
      res.status(400).json({ error: error.message });
    }
  };
  
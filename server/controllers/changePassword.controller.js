const { text } = require("express");
const User = require("../models/user.model"); // Adjust path as needed

const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    console.log("Request body:", req.body);

    const user = await User.findOne({ id: userId });
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    console.log("User found:", user);

    if (user.password !== currentPassword) {
      console.log("Incorrect current password");
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error("Error in changePassword:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", text: err.message });
  }
};

module.exports = {
  changePassword,
};

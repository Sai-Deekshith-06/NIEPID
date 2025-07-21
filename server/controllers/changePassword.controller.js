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

const checkUserForReset = async (req, res) => {
  const { userId } = req.body
  const user = await User.findOne({ id: userId })
  if (!user) {
    console.log(`[ checkUserForReset ] - User with ID: ${userId} not found to reset password`);
    return res
      .status(404)
      .json({ success: false, message: "User not found." });
  }
  console.log(`[ checkUserForReset ] - User with ID: ${userId} was found to reset password`);
  return res
    .status(200)
    .json({ success: true, message: "User found.", role: user.role });
}

const resetPasswordConfirm = async (req, res) => {
  const { userId, adminID, confirmationPassword } = req.body
  await User.findOne({ id: adminID })
    .then((res1) => {
      if (res1.password !== confirmationPassword) {
        return res.status(400).json({ success: false, message: "Incorrect Password" })
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, message: err })
    })
  await User.findOneAndUpdate({ id: userId }, { password: userId })
    .then((res1) => {
      return res.status(200).json({ success: true })
    })
    .catch((err) => {
      console.log(`[resetPasswordConfirm] - ${err}`)
      res.status(404).json({ success: false, message: err })
    })
}

module.exports = {
  changePassword, checkUserForReset, resetPasswordConfirm,
};

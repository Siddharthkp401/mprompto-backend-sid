exports.logoutUser = (req, res) => {
    res.status(200).json({
      status: true,
      message: "Logout successful",
    });
  };
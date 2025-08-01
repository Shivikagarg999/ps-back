const Beautician = require("../../models/beautician/beautician");
const bcrypt = require("bcrypt");

const registerBeautician = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      services, // should be array of service ObjectIds
      id,
      availability,
      address,
      profilePic,
      password,
    } = req.body;

    // Check if beautician already exists
    const existingBeautician = await Beautician.findOne({ phone });
    if (existingBeautician) {
      return res.status(400).json({ message: "Beautician already exists with this phone number" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const beautician = new Beautician({
      name,
      phone,
      email,
      services,
      id,
      availability,
      address,
      profilePic,
      password: hashedPassword,
    });

    await beautician.save();
    res.status(201).json({ message: "Beautician registered successfully", beautician });
  } catch (error) {
    console.error("Error registering beautician:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerBeautician,
};

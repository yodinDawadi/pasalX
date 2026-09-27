const User = require("../models/user");
const bcrypt = require("bcrypt");
const {setUser} = require("../service/auth");
const user = require("../models/user");

 async function handleSignup(req, res) {
  try {
    const { username, email, password,role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email Already taken" });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await newUser.save();
    res.status(201).json({ message: "User Created Sucessfully"});
  } catch (error) {
    console.error("signup error:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

 async function handleLogin(req, res) {
  
  try {
    const { email, password, role} = req.body;
  const user = await User.findOne({ email });
    //check if user exist or not
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    //checking password
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (passwordIsCorrect) {
      //Generate JWT token
      const token = setUser(user);
      res.cookie("uid", token);
      return res.status(201).json([user,token]);
    } else {
      return res.status(400).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

function handleLogout(req, res) {
  res.clearCookie("uid");
  res.status(200).json({ message: "Logged out successfully" });
}

 async function getUser(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password ");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the user details" });
  }
}

module.exports = {
    handleLogin,handleSignup,handleLogout,getUser
}

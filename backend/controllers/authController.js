const User = require("../models/User");
const createToken = require("../utils/jwt");

exports.register = async (req, res) => {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User exists" });
      user = new User({ email, password });
      await user.save();
      const token = createToken(user._id);
      res.json({ token });
};

exports.login = async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ msg: "Invalid credentials" });
      const token = createToken(user._id);
      res.json({ token });
};

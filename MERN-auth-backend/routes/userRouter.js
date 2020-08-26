const router = require("express").Router();
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
  let { email, password, passwordCheck, displayName } = req.body;

//validation

try {

  if (!email || !password || !passwordCheck)
    return res.status(400).json({ msg: "Not all data its correct."});
  if (password.length < 8 )
    return res.status(400).json({ msg: "The password should be more than 8 carachters."});
  if(password !== passwordCheck)
    return res.status(400).json({ msg: "For verification you need the same password."});
 
const existingUser = User.findOne({email: email})
  if (!existingUser)
    return res.status(400).json({ msg: "This email exist with other account."});

 
if (!displayName) displayName = email;

const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash(password, salt);
 
const newUser = new User({
  email,
  passwordHash,
  displayName
});

const saveUser = await newUser.save();
res.json(saveUser);

} catch (err) {
  res.status(500).json({error: err.message});
}
});

router.post("/login", async (req, res) => {

  // VALIDATION AND CONFIRMATION OF DATA 

  try{
    const { email, password } = req.body;

     if (!email || !password)
      return res.status(400).json({ msg: "Not all data its correct."});

    const User = await User.findOne({ email: email });
     if (!user)
      return res.status(400).json({ msg: "Not account with this email."});

    const isMatch =  await bcrypt.compare(password, user.password);
     if (!isMatch)
      return res.status(400).json({ msg: "The data is incorrect"});

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
    },
      });
       

} catch (err) {
  res.status(500).json({error: err.message});
}
});

router.post("/tokenIsValid", async (req, res) =>{
  try {

    const token = req.header("x-auth-token");
      if (!token) return res.json(false);

    const verfied = jwt.verify(token, process.env.JWT_TOKEN);
      if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);

  } catch (err) {
  res.status(500).json({error: err.message});
}
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: displayName,
    id: user._id,
  });
});

module.exports = router;
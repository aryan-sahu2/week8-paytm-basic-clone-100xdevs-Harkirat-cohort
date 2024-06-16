const express = require("express");
const router = express.Router();
const z = require("zod");
const {User} = require("../db");
const {Account} = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const bcrypt = require("bcrypt");
const authMiddleware = require("./middleware");

console.log("from user.js",User);

const userSignUpSchema = z.object({
  username: z.string().email().min(3).max(30),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

const resetDetailSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().min(3).optional(),
});

const userSignInSchema = z.object({
  username: z.string().email().min(3).max(15),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  let { username, firstName, lastName, password } = req.body;
  //do zod input validation
  let { error, success } = userSignUpSchema.safeParse({
    username,
    firstName,
    lastName,
    password,
  });

  console.log(error, success, req.body);

  const isUserExists = await User.findOne({ username: username });

  if (error || isUserExists) {
    return res
      .status(411)
      .json({ message: "Email already taken / Incorrect Inputs" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username: username,
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
  });


  //account and balance allotment to the person
  await Account.create({
    userId: newUser._id,
    balance: 1 + Math.random() * 10000,
  });

  const jwtToken = jwt.sign({ userID: newUser._id }, JWT_SECRET);

  if (newUser) {
    return res.status(200).json({
      message: "User created successfully",
      token: jwtToken,
    });
  } else {
    console.log("there was some error in the signup activity");
  }
});

router.post("/signin", async (req, res) => {
  let { username, password } = req.body;

  let { error, success } = userSignInSchema.safeParse({
    username,
    password,
  });

  const isUserExists = await User.findOne({ username: username });

  if (error || !isUserExists) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const passwordMatch = await bcrypt.compare(password, isUserExists.password);

  if (isUserExists && passwordMatch) {
    const jwtToken = jwt.sign({ userID: isUserExists._id }, JWT_SECRET);

    return res.status(200).json({
      token: jwtToken,
    });
  } else if (!passwordMatch) {
    res.status(401).json({ message: "Password Incorrect" });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  const isValid = resetDetailSchema.safeParse(req.body).success;

  if (!isValid) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);
  res.status(200).json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const userSearch = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });

  const sendUsers = userSearch.map((e) => ({
    firstName: e.firstName,
    lastName: e.lastName,
    username: e.username,
    _id: e._id.toString(),
  }));
  res.status(200).json(sendUsers);
});

module.exports = router;

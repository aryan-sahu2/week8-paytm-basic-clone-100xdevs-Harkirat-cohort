const express = require("express");
const authMiddleware = require("./middleware");
const { Account } = require("../db");
const router = express.Router();
const mongoose = require("mongoose")

router.get("/balance", authMiddleware, async (req, res) => {
  console.log(req.userId);
  const userAccount = await Account.findOne({ userId: req.userId });
  console.log(userAccount);

  return res.status(200).json({
    balance: userAccount.balance
  });
});


// router.post("/transfer", authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();

//   session.startTransaction();

//   //fetch the accounts within the transactions
//   const { to, amount } = req.body;
//   const userAcc = await Account.findOne({ userId: req.userId }).session(
//     session
//   );

//   if (userAcc.balance < amount) {
//     return res.status(400).json({
//       message: "Insufficient balance",
//     });
//   }

//   const toAcc = await Account.findOne({ userId: to }).session(session);
//   if (!toAcc) {
//     return res.status(400).json({
//       message: "Invalid account",
//     });
//   }

//   // perform the transfer
//   await Account.updateOne(
//     { userId: req.userId },
//     { $inc: { balance: -amount } }
//   ).session(session);
//   await Account.updateOne({ userId: to },
//     { $inc: { balance: amount } }).session(session);

//   //commit the transaction
//   await session.commitTransaction();
//   res.json({ message: "Transfer Successful" });
// });



//the below code is a sequential code without the use of transactions because of mongodb replica instance not being run on this device
router.post("/transfer", authMiddleware, async (req, res) => {
  const { to, amount } = req.body;

  try {
    const userAcc = await Account.findOne({ userId: req.userId });

    if (!userAcc) {
      return res.status(400).json({ message: "User account not found" });
    }

    if (userAcc.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAcc = await Account.findOne({ userId: to });

    if (!toAcc) {
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // Perform the transfer
    userAcc.balance -= amount;
    await userAcc.save();

    toAcc.balance += amount;
    await toAcc.save();

    res.json({ message: "Transfer Successful" });
  } catch (error) {
    console.error("Transfer failed:", error);
    res.status(500).json({ message: "Transfer failed" });
  }
});




module.exports = router;

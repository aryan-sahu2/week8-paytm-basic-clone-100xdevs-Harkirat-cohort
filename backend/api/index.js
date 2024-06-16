const express = require("express");
const userRouter = require('../routes/user');
const router = express.Router();
const accountRouter = require('../routes/account')

router.use('/user',userRouter)
router.use('/account', accountRouter)

module.exports = router;


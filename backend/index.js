const express = require("express");
const app = express();
const rootRouter = require("./api/index");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded())

app.get("/", (req, res) => {
  res.json({ msg: "This is the basic route" });
  console.log();
});

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

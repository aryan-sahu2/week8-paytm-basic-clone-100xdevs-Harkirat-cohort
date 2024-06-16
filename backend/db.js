const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm00");
//mongodb://localhost:27017/?replicaSet=mongo
// mongod --replSet rs0 --dbpath c:\Program Files\MongoDB\Server\7.0\bin --port 27017
//mongod --replSet rs0 --dbpath C:\Program Files\MongoDB\Server\7.0\data --port 27017

const userSchema= mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    Lowercase: true,
    minLength: 3,
    maxLength: 50,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  } || {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
})

const Account = mongoose.model("Account",accountSchema)
const User = mongoose.model("User", userSchema);

module.exports = {User, Account};

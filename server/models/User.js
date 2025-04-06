// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   userName: String,
//   userEmail: String,
//   password: String,
//   role: String,
//   isActive: {
//     type: Boolean,
//     default: true, // Users are active by default
//   }
// });

// module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
  isActive: {
    type: Boolean,
    default: true, // Users are active by default
  },
  suspendedAt: {
    type: Date,
    default: null, // Null if not suspended
  },
});

module.exports = mongoose.model("User", UserSchema);

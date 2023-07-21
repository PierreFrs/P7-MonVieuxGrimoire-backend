const mongoose = require("mongoose");
// Import unique validator mongoose module to check the uniqueness of the user's email
const uniqueValidator = require("mongoose-unique-validator");
// Data model for database
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// Check the uniqueness of the user's email (unique: true)
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

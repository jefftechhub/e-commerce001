const mongoose = require("mongoose");

const userSchema = {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  accountType: {
    type: String,
    default: "customer",
  },
  ipAddress: String,
  date: {
    type: Date,
    default: Date.now,
  },
};

const productsSchema = {
  title: String,
  image: Array,
  price: String,
  oldPrice: String,
  category: String,
  type: String,
  type: String,
  averageRating: String,
  peopleRated: String,
  date: {
    type: Date,
    default: Date.now,
  },
};

const Users = mongoose.model("Users", userSchema);
const Products = mongoose.model("Products", productsSchema);

module.exports = { Users, Products };

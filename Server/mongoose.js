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
  status: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
    default: "",
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
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: false,
  },
};

const refreshTokenSchema = {
  refreshToken: String,
};

const Users = mongoose.model("Users", userSchema);
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
const Products = mongoose.model("Products", productsSchema);

module.exports = { Users, Products, RefreshToken };

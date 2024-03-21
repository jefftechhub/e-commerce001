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
  names: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
};

const runningOrdersSchema = {
  idUSER: String,
  products: Array,
  date: {
    type: Date,
    default: Date.now,
  },
};

const messageSchema = {
  names: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
};

const cardsSchema = {
  names: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String,
  zip: String,
  country: String,
  date: {
    type: Date,
    default: Date.now,
  },
};

const newslettersEmailSchema = {
  email: String,

  date: {
    type: Date,
    default: Date.now,
  },
};

const Users = mongoose.model("Users", userSchema);
const Cards = mongoose.model("Cards", cardsSchema);
const NewslettersEmail = mongoose.model("Newsletters", newslettersEmailSchema);
const Products = mongoose.model("Products", productsSchema);
const Message = mongoose.model("Message", messageSchema);
const RunningOrders = mongoose.model("RunningOrders", runningOrdersSchema);

module.exports = {
  Users,
  Products,
  Message,
  NewslettersEmail,
  RunningOrders,
  Cards,
};

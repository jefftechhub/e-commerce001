const mongoose = require("mongoose");
require("dotenv").config();

const { Strategy } = require("passport-local");
const bcrypt = require("bcrypt");

const { Users } = require("../mongoose");
mongoose.connect(process.env.MONGO_URL);

const strategy = new Strategy(
  { usernameField: "email" },
  async (username, password, done) => {
    try {
      const findUser = await Users.findOne({ email: username });

      if (!findUser) {
        return done(null, false, { message: "Wrong email" });
      } else {
        bcrypt.compare(password, findUser.password, function (err, result) {
          if (err) {
            return done(null, false, { message: "internal server error" });
          }
          if (result) {
            // Passwords match
            done(null, findUser);
          } else {
            return done(null, false, { message: "invalid password" });
          }
        });
      }
    } catch (error) {
      console.log(error);
      done(error, null);
    }
  }
);

const serialize = async (user, done) => {
  done(null, user.id);
};

const deserialize = async (id, done) => {
  try {
    const findUser = await Users.findOne({ _id: id });
    if (!findUser) {
      throw new Error("please log in");
    } else {
      done(null, findUser);
    }
  } catch (err) {
    done(err, null);
  }
};

module.exports = { strategy, serialize, deserialize };

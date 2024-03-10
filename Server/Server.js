const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cookieparser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  strategy,
  serialize,
  deserialize,
} = require("./Strategy/local-strategy");

const { Users, Products } = require("./mongoose");
mongoose.connect(process.env.MONGO_URL);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieparser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret key",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 60 * 24 * 1000 },
  })
);

passport.use(strategy);
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

app.use(passport.initialize());
app.use(passport.session());

//signing up
const addDetails = (req, res, next) => {
  try {
    req.body.ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    next();
  } catch (error) {
    return res.json({ success: false, message: "internal server error" });
  }
};

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.json({ success: false, message: "your session has expired" });
  }
  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/products/uploads", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    } else {
      const filePath = `api/uploads/${req.file.filename}`;

      return res.status(200).json({ success: true, data: filePath });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

app.get("/api/uploads/:imageUrl", async (req, res) => {
  const filename = req.params.imageUrl;
  const file = path.join(__dirname, `uploads/${filename}`);

  res.status(200).sendFile(file);
});

///upload products detail

app.post("/api/uploadProduct", async (req, res) => {
  try {
    const checkProduct = await Products.findOne({
      title: req.body.title,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      category: req.body.category,
      type: req.body.type,
      averageRating: req.body.averageRating,
      peopleRated: req.body.peopleRated,
    });

    if (!checkProduct) {
      const product = req.body;

      await Products.create(product);
      return res
        .status(200)
        .json({ success: true, message: "product uploaded successfully" });
    } else {
      return res.json({ success: false, message: "product already exist" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

app.delete("/api/uploads/:imageUrl", async (req, res) => {
  try {
    const fileName = req.params.imageUrl;
    const filePath = path.join(__dirname, `uploads/${fileName}`);

    fs.unlink(filePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "internal server error" });
      } else {
        return res.status(200).json({ success: true });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
});

app.get("/api/auth/dashboard", requireAuth, async (req, res) => {
  try {
    const user = {
      firstName: req.user.firstName,
      email: req.user.email,
      id: req.user._id,
      accountType: req.user.accountType,
    };
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, login: true, message: "internal server error" });
  }
});

app.post("/api/signup", addDetails, async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      req.body.password = hashedPassword;

      await Users.create(req.body);
      res
        .status(200)
        .json({ success: true, message: "user added succesfully" });
    } else {
      res.status(200).json({ success: false, message: "email exist" });
    }
  } catch (error) {
    res.json({ success: false, message: "internal server error" });
  }
});

// log in
app.post("/api/auth", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ login: false, message: "Internal server error" });
    }
    if (!user) {
      return res.json({ login: false, message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ login: false, message: "Internal  server error" });
      }
      return res.status(200).json({ login: true, user });
    });
  })(req, res, next);
});

// log out

app.post("/api/logout", async (req, res) => {
  if (!req.user)
    return res.json({
      success: false,
      message: "you are not logged in",
    });
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ login: true, message: "internal server error" });
    } else {
      return res.json({ login: false, message: "logged out" });
    }
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000...");
});

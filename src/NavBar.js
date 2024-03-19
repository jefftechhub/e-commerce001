import React, { useEffect, useState } from "react";
import "./Component_css/NavBar.css";
import { Link } from "react-router-dom";

function Navbar({ login, cart }) {
  const [showSearch, setSearch] = useState(false);
  const [showMenu, setMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("loggedIn" === "true")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const cartLength = cart.length;

  const submitHandler = (e) => {
    e.preventDefault();
    setSearch(false);
  };

  return (
    <nav>
      <div class="header">
        <img className="logoHeading" src="/icons/LOGO.png" alt="logo" />
        <div class="cartContainer">
          <form onSubmit={submitHandler}>
            {showSearch && (
              <div className="search">
                <input type="search" id="search" placeholder="Search" />
                <button type="submit">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            )}
            {!showSearch && (
              <i
                class="fa-solid fa-magnifying-glass"
                onClick={() => setSearch(!showSearch)}
              ></i>
            )}
          </form>
          <Link to="dashboard">
            <i class="fa-regular fa-user"></i>
          </Link>
          <Link to="cart" id="cart">
            {cartLength > 0 && <p>{cartLength}</p>}
            <i class="fa-solid fa-cart-shopping"></i>
          </Link>
          {!login && (
            <Link id="loginbtn" to="login">
              Log in
            </Link>
          )}
          <div className="menu">
            {showMenu ? (
              <i
                className="fa-solid fa-xmark"
                onClick={() => {
                  setMenu(!showMenu);
                }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-bars"
                onClick={() => {
                  setMenu(!showMenu);
                }}
              ></i>
            )}
          </div>
        </div>
        <div className={showMenu ? "menuList menuListAppear" : "menuList"}>
          <ul>
            <Link
              to="/"
              onClick={() => {
                setMenu(!showMenu);
              }}
            >
              <i class="fa-solid fa-house"></i> Home
            </Link>
            <Link
              to="shop"
              onClick={() => {
                setMenu(!showMenu);
              }}
            >
              <i class="fa-solid fa-shop"></i> Shop
            </Link>
            <Link
              to="contactus"
              onClick={() => {
                setMenu(!showMenu);
              }}
            >
              <i class="fa-solid fa-phone"></i> contact us
            </Link>
            <Link
              to="aboutus"
              onClick={() => {
                setMenu(!showMenu);
              }}
            >
              <i class="fa-solid fa-users"></i> about us
            </Link>
          </ul>
        </div>
      </div>

      <div className="headList-mwitu"></div>

      <div class="headerList">
        <ul>
          <Link to="/">Home</Link>
          <Link to="shop">Shop</Link>
          <Link to="contactUs">contact us</Link>
          <Link to="/aboutUs">about us</Link>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

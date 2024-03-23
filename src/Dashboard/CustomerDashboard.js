import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSignOut } from "./useSignout";

function CustomerDashBoard({ id, email, firstName, setLogin }) {
  const { logOut } = useSignOut();

  return (
    <div className="dashbordContainer">
      <div className="profile-mwitu"></div>
      <div className="profile">
        <header>
          <h1>Account</h1>
          <h2>Welcome {firstName}</h2>
          <h3>{email}</h3>
        </header>
        <main>
          <Link to="/">
            <div>
              <i class="fa-solid fa-house"></i> <p>Home</p>
            </div>
          </Link>
          <Link to="orders">
            <div>
              <i class="fa-solid fa-truck"></i> <p>orders</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link to="vouchers">
            <div>
              <i class="fa-solid fa-ticket"></i>
              <p>vouchers</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link to="wishlist">
            <div>
              <i class="fa-solid fa-heart"></i> <p>Wishlist</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link to="accountManagement">
            <div>
              <i class="fa-solid fa-address-card"></i> <p>Account management</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link
            onClick={() => {
              logOut();
              setLogin(false);
            }}
          >
            <div>
              <i class="fa-solid fa-right-from-bracket"></i>
              <p>sign out</p>
            </div>
          </Link>
        </main>
      </div>
      <Outlet context={[id]} />
    </div>
  );
}

export default CustomerDashBoard;

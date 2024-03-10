import React from "react";
import { Link, Outlet } from "react-router-dom";

function OwnerDashboard() {
  return (
    <div className="dashbordContainer">
      <div className="profile">
        <header>
          <h1>Owner</h1>
          <h2>Welcome Onyinjo</h2>
          <h3>onyinjopesa@gmail.com</h3>
        </header>
        <main>
          <Link to="orders">
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
          <Link to="savedItems">
            <div>
              <i class="fa-solid fa-heart"></i> <p>saved items</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link to="accountManagement">
            <div>
              <i class="fa-solid fa-address-card"></i> <p>Account management</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link to="signOut">
            <div>
              <i class="fa-solid fa-right-from-bracket"></i>
              <p>sign out</p>
            </div>
          </Link>
        </main>
      </div>
      <Outlet />
    </div>
  );
}

export default OwnerDashboard;

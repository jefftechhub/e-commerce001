import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "./useSignout";
import axios from "../Axios";

function AdminDashBoard({ firstName, email }) {
  const navigate = useNavigate();
  const { logOut } = useSignOut();

  const [showContent, setShowContent] = useState(
    sessionStorage.getItem("showContent") || false
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 500) {
        setShowContent(true);
      } else {
        sessionStorage.setItem("showContent", showContent);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showContent]);

  return (
    <div className="dashbordContainer">
      <div className="profile-mwitu"></div>

      <div className="profile">
        <header>
          <h1>Admin</h1>
          <h2>Welcome {firstName}</h2>
          <h3>{email}</h3>
        </header>
        <main>
          <Link
            to="/"
            onClick={() => {
              sessionStorage.removeItem("showContent");
            }}
          >
            <div>
              <i class="fa-solid fa-house"></i> <p>Home</p>
            </div>
          </Link>
          <Link
            to="products"
            onClick={() => {
              setShowContent(true);
            }}
          >
            <div>
              <i class="fa-brands fa-product-hunt"></i> <p>products</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link
            to="cards"
            onClick={() => {
              setShowContent(true);
            }}
          >
            <div>
              <i class="fa-solid fa-ticket"></i>
              <p>cards</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>

          <Link
            to="orders"
            onClick={() => {
              setShowContent(true);
            }}
          >
            <div>
              <i class="fa-solid fa-truck"></i> <p>orders</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>

          <Link
            to="accountManagement"
            onClick={() => {
              setShowContent(true);
            }}
          >
            <div>
              <i class="fa-solid fa-address-card"></i> <p>customers</p>
            </div>
            <i class="fa-solid fa-greater-than"></i>
          </Link>
          <Link
            to="signOut"
            onClick={() => {
              sessionStorage.removeItem("showContent");
              logOut();
            }}
          >
            <div>
              <i class="fa-solid fa-right-from-bracket"></i>
              <p>sign out</p>
            </div>
          </Link>
        </main>
      </div>
      {showContent && <Outlet context={[setShowContent]} />}
    </div>
  );
}

export default AdminDashBoard;

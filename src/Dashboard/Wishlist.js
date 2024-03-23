import React, { useState } from "react";
import "./DashboardCss/Wishlist.css";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  return (
    <div className="wishlistContainer">
      <div className="wishlistInternalContainer">
        <Link to={"/dashboard"}>
          <i class="fa-solid fa-arrow-left"></i>
        </Link>
        {!wishlist.length > 0 ? (
          <div className="emptywishlistContainer">
            <div>
              <p>Add items to your wishlist</p>
              <img src="/icons/wishlist.png" />
            </div>
          </div>
        ) : (
          <div>vouchers</div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

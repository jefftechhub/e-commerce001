import React from "react";
import { Link } from "react-router-dom";
import "../Component_css/Shop.css";

function ShopComp({ collection, heading }) {
  return (
    <section>
      <div className="head">
        <h1>{heading}</h1>
        <Link to="/collection">see more</Link>
      </div>
      <div className="collectionContainer">
        {collection.map((item) => {
          return (
            <div className="singlecollection">
              {item.oldPrice && (
                <p className="offer">
                  -{Math.floor(((item.oldPrice - item.price) / 100) * 100)}%
                </p>
              )}
              <i class="fa-regular fa-heart"></i>
              <img src={process.env.PUBLIC_URL + item.image} />
              <Link to="/product">
                <h3>{item.name}</h3>
                <div className="rating">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                </div>
                <div>
                  <p>
                    <i class="fa-solid fa-dollar-sign"></i>
                    {item.price}
                  </p>
                  {item.oldPrice && (
                    <p id="oldP">
                      <i class="fa-solid fa-dollar-sign"></i>
                      {item.oldPrice}
                    </p>
                  )}
                </div>
                <button type="button">Add to cart</button>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ShopComp;

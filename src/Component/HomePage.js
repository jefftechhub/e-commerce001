import React from "react";
import { Link } from "react-router-dom";
import "../Component_css/Homepage.css";

export const Banner = () => {
  return (
    <div class="banner">
      <div>
        <h1>Explore a curated selection of furniture</h1>
        <h2>
          From sleek sofas to eye-catching accents, our collection offers
          something for every style and budget. Don't miss out on the chance to
          transform your home into the haven you've always dreamed of
        </h2>
        <a href="/shop">shop now</a>
      </div>
      <div>
        <img src={process.env.PUBLIC_URL + "/uploads/banner2.webp"} />
      </div>
    </div>
  );
};

export const Enticement = () => {
  return (
    <div class="collections">
      <Link to="/collection">
        <div>
          <img src="/icons/livingroom.png" />
          <p>LIVING ROOM</p>
        </div>
      </Link>
      <Link to="/collection">
        <div>
          <img src="/icons/livingroom.png" />
          <p>KITCHEN</p>
        </div>
      </Link>
      <Link to="/collection">
        <div>
          <img src="/icons/livingroom.png" />
          <p>BEDROOM</p>
        </div>
      </Link>
      <Link to="/collection">
        <div>
          <img src="/icons/outdoor.png" />
          <p>OTHERS</p>
        </div>
      </Link>
    </div>
  );
};

export const TopProducts = ({ name, price, image }) => {
  return (
    <div class="singleProduct">
      <i class="fa-regular fa-heart"></i>
      <i class="fa-solid fa-plus"></i>
      <img src={process.env.PUBLIC_URL + image} alt="Top Product" />
      <Link to="/product">
        <h3>{name}</h3>
        <div>
          <p>
            <i class="fa-solid fa-dollar-sign"></i>
            {price}
          </p>
        </div>
      </Link>
    </div>
  );
};

export const DisplayedOffer = ({ price, oldPrice, name, image }) => {
  return (
    <div class="singleOffer">
      <div class="offerTag">
        <p>
          upto
          <br />
          <span>61</span>
          <span id="percent">%</span>
          <br />
          OFF
        </p>
      </div>
      <img src={process.env.PUBLIC_URL + image} alt="Offer" />
      <h2>{name}</h2>
    </div>
  );
};

export const FeaturedProduct = ({ product }) => {
  return (
    <div class="featuredProduct">
      <h2>Featured Product</h2>
      <div class="featuredContainer">
        <img
          src={process.env.PUBLIC_URL + product.image}
          alt="Featured Product"
        />
        <div class="lastChild">
          <h3>{product.name}</h3>
          <h4>{product.description}</h4>
          <div class="price">
            <p>
              <i class="fa-solid fa-dollar-sign"></i>
              {product.price}
            </p>
            {product.oldPrice && (
              <p id="oldPrice">
                <i class="fa-solid fa-dollar-sign"></i>
                {product.oldPrice}
              </p>
            )}
          </div>
          <button type="button">Add to cart</button>
        </div>
      </div>
    </div>
  );
};

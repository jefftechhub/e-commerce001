import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Component_css/Homepage.css";

export const Banner = () => {
  return (
    <div class="banner">
      <div>
        <h1>Explore a curated selection of furnitures</h1>
        <h2>
          From sleek sofas to eye-catching accents, our collection offers
          something for every style and budget. Don't miss out on the chance to
          transform your home into the haven you've always dreamed of
        </h2>
        <Link to="shop">shop now</Link>
      </div>
      <div>
        <img src={process.env.PUBLIC_URL + "/uploads/bannerSofa.jpg"} />
      </div>
    </div>
  );
};

export const Enticement = () => {
  return (
    <div class="collections">
      <Link to="collection/livingroom">
        <div>
          <img src="/icons/livingroom.png" />
          <p>LIVING ROOM</p>
        </div>
      </Link>
      <Link to="collection/kitchen">
        <div>
          <img src="/icons/livingroom.png" />
          <p>KITCHEN</p>
        </div>
      </Link>
      <Link to="collection/bedroom">
        <div>
          <img src="/icons/livingroom.png" />
          <p>BEDROOM</p>
        </div>
      </Link>
      <Link to="collection/outdoor">
        <div>
          <img src="/icons/outdoor.png" />
          <p>OTHERS</p>
        </div>
      </Link>
    </div>
  );
};

export const TopProducts = ({ id, oldPrice, price, image }) => {
  const percentage = Math.floor(((oldPrice - price) / 100) * 100);

  return (
    <div class="singleProduct">
      {oldPrice && <p className="offer">-{percentage}%</p>}
      <i class="fa-regular fa-heart"></i>
      <i class="fa-solid fa-plus"></i>
      <Link to={`product/${id}`}>
        <img src={process.env.PUBLIC_URL + image} alt="Top Product" />

        <div id="topProductRating" className="rating">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
        </div>
        <div class="topProductPrice">
          <p>
            <i class="fa-solid fa-dollar-sign"></i>
            {price}
          </p>
          {oldPrice && (
            <p id="oldPrice">
              <i class="fa-solid fa-dollar-sign"></i>
              {oldPrice}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export const DisplayedOffer = ({ price, oldPrice, name, image, id }) => {
  const percentage = Math.floor(((oldPrice - price) / 100) * 100);

  return (
    <div class="singleOffer">
      <Link to={`product/${id}`}>
        <div class="offerTag">
          <p>
            upto
            <br />
            <span>{percentage}</span>
            <span id="percent">%</span>
            <br />
            OFF
          </p>
        </div>
        <img src={process.env.PUBLIC_URL + image} alt="Offer" />
        <h2>{name}</h2>
      </Link>
    </div>
  );
};

export const FeaturedProduct = (props) => {
  const { oldPrice, price, name, description, image } = props;
  let [value, setValue] = useState(1);

  const percentage = Math.floor(((oldPrice - price) / 100) * 100);

  return (
    <div class="featuredProduct">
      <h2>Featured Product</h2>
      <div class="featuredContainer">
        <img src={process.env.PUBLIC_URL + image} alt="Featured Product" />
        <div class="lastChild">
          <h3>{name}</h3>
          <h4>{description}</h4>

          <div className="quantity">
            <i
              class="fa-solid fa-plus"
              onClick={() => {
                if (value < 100) {
                  setValue(parseInt(value) + 1);
                } else {
                  setValue(100);
                }
              }}
            ></i>
            <input
              type="number"
              name="values"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <i
              class="fa-solid fa-minus"
              onClick={() => {
                if (value > 1) {
                  setValue(parseInt(value) - 1);
                } else {
                  setValue(1);
                }
              }}
            ></i>
          </div>

          <div className="rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>

          <div class="price">
            <p>
              <i class="fa-solid fa-dollar-sign"></i>
              {price}
            </p>
            {oldPrice && (
              <p id="oldPrice">
                <i class="fa-solid fa-dollar-sign"></i>
                {oldPrice}
              </p>
            )}
            {oldPrice && (
              <p className="offer" id="featuredOffer">
                -{percentage}%
              </p>
            )}
          </div>
          <button type="button">Add to cart</button>
        </div>
      </div>
    </div>
  );
};
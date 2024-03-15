import React from "react";
import { Link } from "react-router-dom";

export const CollectionComp = (props) => {
  const { oldPrice, price, image, name, id, title, addtocart } = props;

  return (
    <div className="singlecollection">
      {oldPrice && (
        <p className="offer">
          -{Math.floor(((oldPrice - price) / 100) * 100)}%
        </p>
      )}
      <i class="fa-regular fa-heart"></i>
      <Link to={`/product/${id}`}>
        {image && <img src={`/${image[0]}`} />}

        <h3>{name}</h3>
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
            {parseInt(price).toFixed(2)}
          </p>
          {oldPrice && (
            <p id="oldP">
              <i class="fa-solid fa-dollar-sign"></i>
              {parseInt(oldPrice).toFixed(2)}
            </p>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => {
          addtocart(id, title, image[0], price);
        }}
      >
        Add to cart
      </button>
    </div>
  );
};

export const ViewAlso = ({ collection, image }) => {
  return (
    <Link to={`/collection/${collection}`} className="viewAlso">
      <div>
        {image && <img src={`/${image[0]}`} />}
        <h3>{collection}</h3>
      </div>
    </Link>
  );
};

import React from "react";
import { Link } from "react-router-dom";

export const CollectionComp = (props) => {
  const { oldPrice, price, image, name, id } = props;

  return (
    <div className="singlecollection">
      {oldPrice && (
        <p className="offer">
          -{Math.floor(((oldPrice - price) / 100) * 100)}%
        </p>
      )}
      <i class="fa-regular fa-heart"></i>
      <Link to={`/product/${id}`}>
        <img src={process.env.PUBLIC_URL + image} />

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
            {price}
          </p>
          {oldPrice && (
            <p id="oldP">
              <i class="fa-solid fa-dollar-sign"></i>
              {oldPrice}
            </p>
          )}
        </div>
      </Link>
      <button type="button">Add to cart</button>
    </div>
  );
};

export const ViewAlso = ({ collection, image }) => {
  return (
    <Link to={`/collection/${collection}`} className="viewAlso">
      <div>
        <img src={process.env.PUBLIC_URL + image} />
        <h3>{collection}</h3>
      </div>
    </Link>
  );
};

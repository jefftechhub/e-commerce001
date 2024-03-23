import React, { useState } from "react";

function ProductComp(props) {
  const { oldPrice, price, title, image, id, addtocart, addingToWishlist } =
    props;
  let [value, setValue] = useState(1);

  const percentage = Math.floor(
    ((parseInt(oldPrice) - parseInt(price)) / parseInt(oldPrice)) * 100
  );

  return (
    <div class="featuredProduct">
      <div class="featuredContainer">
        {image && <img src={`/${image[0]}`} />}
        <div class="lastChild">
          <h3>{title}</h3>

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
              {parseInt(price).toFixed(2)}
            </p>
            {oldPrice && (
              <p id="oldPrice">
                <i class="fa-solid fa-dollar-sign"></i>
                {parseInt(oldPrice).toFixed(2)}
              </p>
            )}
            {oldPrice && (
              <p className="offer" id="featuredOffer">
                -{percentage}%
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              addtocart(id, title, image[0], price);
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductComp;

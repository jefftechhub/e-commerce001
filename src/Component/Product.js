import React, { useState } from "react";

function ProductComp(props) {
  const { oldPrice, price, name, description, image } = props;
  let [value, setValue] = useState(1);

  const percentage = Math.floor(((oldPrice - price) / 100) * 100);

  return (
    <div class="featuredProduct">
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
}

export default ProductComp;

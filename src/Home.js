import React from "react";
import { data } from "./data";
import {
  Banner,
  Enticement,
  TopProducts,
  DisplayedOffer,
  FeaturedProduct,
} from "./Component/HomePage";

function Home() {
  const topProducts = data.slice(0, 8);
  const offers = data.filter((item) => item.oldPrice > 0).splice(0, 5);
  const featuredProduct = data[Math.floor(Math.random() * data.length)];

  return (
    <div class="homeContainer">
      <a href="#">
        <i class="fa-regular fa-hand-point-up"></i>
      </a>
      <Banner />
      <section>
        <Enticement />
        <div class="top_products">
          <header>
            <h2>Top products</h2>
            <div>
              <button>best sellers</button>
              <button>new arrivals</button>
            </div>
          </header>
          <div class="products">
            {topProducts.map((item) => {
              return <TopProducts {...item} />;
            })}
          </div>
        </div>
        <div class="offers-container">
          {offers.map((item) => {
            return <DisplayedOffer {...item} />;
          })}
        </div>
        <FeaturedProduct {...featuredProduct} />
      </section>
    </div>
  );
}

export default Home;

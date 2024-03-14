import React, { useState, useEffect } from "react";
import {
  Banner,
  Enticement,
  Products,
  DisplayedOffer,
  FeaturedProduct,
} from "./Component/HomePage";
import { useOffer, useFeatured, useTopProducts } from "./useGet";
import "./Component_css/Homepage.css";

function Home({ addtocart }) {
  const [offerProducts, setOfferProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState({});
  const [topProducts, setTopProducts] = useState([]);

  const { dataTop, loadingTop } = useTopProducts();
  const { dataOffer, loadingOffer } = useOffer();
  const { dataFeatured, loadingFeatured } = useFeatured();

  useEffect(() => {
    if (dataTop) {
      setTopProducts(dataTop);
    }
    if (dataOffer) {
      setOfferProducts(dataOffer);
    }
    if (dataFeatured) {
      setFeaturedProduct(dataFeatured);
    }
  }, [dataFeatured, dataOffer, dataTop]);

  return (
    <div class="homeContainer">
      <a href="#">
        <i class="fa-regular fa-hand-point-up"></i>
      </a>
      <Banner />
      <section>
        <Enticement />

        {loadingTop ? (
          <div className="homeloadingAnimationContainer">
            <p className="loadingAnimation"></p>
          </div>
        ) : (
          <div class="top_products">
            <header>
              <h2>Top products</h2>
            </header>
            <div class="products">
              {topProducts.map((item) => {
                return <Products {...item} addtocart={addtocart} />;
              })}
            </div>
          </div>
        )}

        {loadingOffer ? (
          <div className="homeloadingAnimationContainer">
            <p className="loadingAnimation"></p>
          </div>
        ) : (
          <div class="offers-container">
            {offerProducts.map((item) => {
              return <DisplayedOffer {...item} />;
            })}
          </div>
        )}

        {loadingFeatured ? (
          <div className="homeloadingAnimationContainer">
            <p className="loadingAnimation"></p>
          </div>
        ) : (
          <FeaturedProduct {...featuredProduct} addtocart={addtocart} />
        )}
      </section>
    </div>
  );
}

export default Home;

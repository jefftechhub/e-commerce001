import React, { useEffect, useState } from "react";
import ShopPage from "./Component/ShopPage";
import "./Component_css/Shop.css";
import { useGet } from "./useGet";

function Shop({ addtocart }) {
  const [livingRoom, setLivingRoom] = useState([]);
  const [bedRoom, setBedRoom] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [kitchen, setKitchen] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const { data, loading } = useGet("/api/shop");

  useEffect(() => {
    if (data) {
      setLivingRoom(data.livingroom);
      setBedRoom(data.bedroom);
      setBestDeals(data.best);
      setKitchen(data.kitchen);
      setRecommended(data.recommended);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <div className="shoploadingAnimationContainer">
          <p className="loadingAnimation"></p>
        </div>
      ) : (
        <div className="shopContainer">
          <a href="#">
            <i class="fa-regular fa-hand-point-up"></i>
          </a>
          <h1 id="shop">shop</h1>
          <ShopPage
            collection={livingRoom}
            heading={"livingroom"}
            addtocart={addtocart}
          />

          <ShopPage
            collection={bedRoom}
            heading={"bedroom"}
            addtocart={addtocart}
          />

          <ShopPage
            collection={recommended}
            heading={"recommended for you"}
            addtocart={addtocart}
          />

          <ShopPage
            collection={kitchen}
            heading={"kitchen"}
            addtocart={addtocart}
          />

          <ShopPage
            collection={bestDeals}
            heading={"best deals"}
            addtocart={addtocart}
          />
        </div>
      )}
    </>
  );
}

export default Shop;

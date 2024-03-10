import React, { useEffect, useState } from "react";
import { data } from "./data";
import ShopPage from "./Component/ShopPage";
import "./Component_css/Product.css";
import { Link } from "react-router-dom";

function Shop() {
  const [livingRoom, setLivingRoom] = useState([]);
  const [bedRoom, setBedRoom] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [kitchen, setKitchen] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (data) {
      const livingRoom = data.filter(
        (item) => item.collection === "livingroom"
      );
      setLivingRoom(livingRoom.splice(0, 8));
      const bedRoom = data.filter((item) => item.collection === "bedroom");
      setBedRoom(bedRoom.splice(0, 8));
      const bestDeals = data.filter((item) => item.oldPrice > 0);
      setBestDeals(bestDeals.splice(0, 8));
      const kitchen = data.filter((item) => item.collection === "kitchen");
      setKitchen(kitchen.splice(0, 8));
      const recommended = data.filter((item) => item.collection === "outdoor");
      setRecommended(recommended.splice(0, 8));
    }
  }, []);

  return (
    <div className="shopContainer">
      <a href="#">
        <i class="fa-regular fa-hand-point-up"></i>
      </a>
      <h1 id="shop">shop</h1>
      <ShopPage collection={livingRoom} heading={"livingroom"} />

      <ShopPage collection={bedRoom} heading={"bedroom"} />

      <ShopPage collection={recommended} heading={"recommended for you"} />

      <ShopPage collection={kitchen} heading={"kitchen"} />

      <ShopPage collection={bestDeals} heading={"best deals"} />
    </div>
  );
}

export default Shop;

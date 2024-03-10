import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import MainComponent from "./MainComponent";
import Home from "./Home";
import Collections from "./Collections";
import Product from "./Product";
import Shop from "./Shop";
import Login from "./Login";
import Signup from "./Signup";
import FixedNotification from "./FixedNotification";

import DashBoardNavBar from "./Dashboard/DashboardNavBar";
import Orders from "./Dashboard/Orders";
import AccountManagement from "./Dashboard/AccountManagement";
import SavedItems from "./Dashboard/SavedItems";
import Vouchers from "./Dashboard/Vouchers";
import Products from "./Dashboard/Products";
import Cards from "./Dashboard/Cards";
import AddProducts from "./Dashboard/AddProducts";
import Wallpaper from "./Dashboard/Wallpaper";

function App() {
  // this is for fixed notification

  const [show, setShow] = useState(false);
  const [login, setLogin] = useState(true);

  return (
    <React.Fragment>
      {show && <FixedNotification setShow={setShow} />}
      <Routes>
        <Route path="/login" element={<Login setLogin={setLogin} />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={<MainComponent login={login} setLogin={setLogin} />}
        >
          <Route index={true} element={<Home />} />
          <Route path="collection/:collection" element={<Collections />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="shop" element={<Shop />} />
        </Route>

        {/* dashboard  */}

        <Route
          path="dashboard"
          element={<DashBoardNavBar setShow={setShow} setLogin={setLogin} />}
        >
          <Route index={true} element={<Wallpaper />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="accountManagement" element={<AccountManagement />} />
          <Route path="savedItems" element={<SavedItems />} />
          <Route path="cards" element={<Cards />} />
          <Route path="vouchers" element={<Vouchers />} />
          <Route path="addproducts" element={<AddProducts />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;

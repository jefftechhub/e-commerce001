import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Home";
import Collections from "./Collections";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import NavBar from "./NavBar";
import Product from "./Product";
import Shop from "./Shop";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/collection" Component={Collections} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/product" Component={Product} />
        <Route path="/shop" Component={Shop} />
      </Routes>
      <Footer />
    </React.Fragment>
  );
}

export default App;

import React, { useState } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Loading from "./Loading";

function MainComponent({ login, setLogin, cart }) {
  const [loading, setLoading] = useState(false);

  return (
    <React.Fragment>
      <NavBar login={login} cart={cart} />
      {loading ? <Loading /> : <Outlet loading={loading} setLogin={setLogin} />}
      <Footer />
    </React.Fragment>
  );
}

export default MainComponent;

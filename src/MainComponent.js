import React from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function MainComponent({ login, setLogin }) {
  return (
    <React.Fragment>
      <NavBar login={login} />
      <Outlet setLogin={setLogin} />
      <Footer />
    </React.Fragment>
  );
}

export default MainComponent;

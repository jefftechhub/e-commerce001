import React from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import AddtocartComp from "./AddtocartComp";

function MainComponent({
  login,
  cart,
  addtocartMssg,
  setShowAddecart,
  showaddedcart,
}) {
  return (
    <React.Fragment>
      {showaddedcart && (
        <AddtocartComp
          addtocartMssg={addtocartMssg}
          setShowAddecart={setShowAddecart}
        />
      )}

      <NavBar login={login} cart={cart} />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
}

export default MainComponent;

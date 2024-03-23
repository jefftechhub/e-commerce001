import React from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import AddtocartComp from "./AddtocartComp";
import AddtoWishlistComp from "./AddtoWishlistComp";

function MainComponent({
  login,
  cart,
  addtocartMssg,
  showaddedcart,
  addtowishlistMssg,
  showaddedwishlist,
  setShowAddedcart,
  setShowAddewishlist,
}) {
  return (
    <React.Fragment>
      {showaddedcart && (
        <AddtocartComp
          addtocartMssg={addtocartMssg}
          setShowAddedcart={setShowAddedcart}
        />
      )}
      {showaddedwishlist && (
        <AddtoWishlistComp
          addtowishlistMssg={addtowishlistMssg}
          setShowAddewishlist={setShowAddewishlist}
        />
      )}

      <NavBar login={login} cart={cart} />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
}

export default MainComponent;

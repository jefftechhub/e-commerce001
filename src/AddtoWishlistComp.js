import React from "react";

function AddtoWishlistComp({ addtowishlistMssg, setShowAddewishlist }) {
  setTimeout(() => {
    setShowAddewishlist(false);
  }, 2000);

  return (
    <div className="addtowishlistComp">
      <p>{addtowishlistMssg}</p>
    </div>
  );
}

export default AddtoWishlistComp;

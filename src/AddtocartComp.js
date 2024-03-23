import React from "react";

function AddtocartComp({ addtocartMssg, setShowAddedcart }) {
  setTimeout(() => {
    setShowAddedcart(false);
  }, 2000);

  return (
    <div className="addtocartComp">
      <p>{addtocartMssg}</p>
    </div>
  );
}

export default AddtocartComp;

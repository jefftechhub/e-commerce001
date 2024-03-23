import React, { useEffect, useState } from "react";
import ProductComp from "./Component/Product";
import { useParams } from "react-router-dom";
import "./Component_css/Product.css";
import { useGet } from "./useGet";

function Product({ addtocart, addingToWishlist }) {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  const { data, loading } = useGet(`/api/product/${id}`);

  useEffect(() => {
    if (data) {
      setProduct(data);
    }
  }, [data]);

  return (
    <React.Fragment>
      {loading ? (
        <div className="productloadingAnimationContainer">
          <p className="loadingAnimation"></p>
        </div>
      ) : (
        <div className="product">
          <ProductComp
            {...product}
            addtocart={addtocart}
            addingToWishlist={addingToWishlist}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default Product;

import React, { useEffect, useState } from "react";
import ProductComp from "./Component/Product";
import { useParams } from "react-router-dom";
import "./Component_css/Product.css";
import { useGet } from "./useGet";

function Product() {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  const { data } = useGet(`/api/product/${id}`);

  useEffect(() => {
    if (data) {
      setProduct(data);
    }
  }, [data]);

  return (
    <div className="product">
      <ProductComp {...product} />
    </div>
  );
}

export default Product;

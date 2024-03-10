import React, { useEffect, useState } from "react";
import ProductComp from "./Component/Product";
import { data } from "./data";
import { useParams } from "react-router-dom";
import "./Component_css/Product.css";

function Product() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const item = data.find((item) => item.id === parseInt(id));
    setProduct(item);
  }, [id]);

  return (
    <div className="product">
      <ProductComp {...product} />
    </div>
  );
}

export default Product;

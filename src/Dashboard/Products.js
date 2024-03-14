import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useGet } from "../useGet";

function Products() {
  const [setShowContent] = useOutletContext();
  const [products, setProducts] = useState([]);

  const { data } = useGet("/api/adminProducts");

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  return (
    <React.Fragment>
      <div className="dashboardContent">
        <header>
          <Link
            id="linkback"
            to="/dashboard"
            onClick={() => {
              setShowContent(false);
            }}
          >
            <i class="fa-solid fa-xmark"></i>
          </Link>
          <Link to="/dashboard/addproducts">add products</Link>
        </header>
        <table>
          <tbody>
            {products.map((item) => {
              return <SingleProduct {...item} />;
            })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

const SingleProduct = ({ image, title }) => {
  const status = true;
  return (
    <tr className="tableRow">
      <td>
        <input id="checkbox" type="checkbox" />
      </td>
      <td>
        <img src={`http://localhost:5000/${image}`} />
      </td>
      <td id="name">{title}</td>
      <td>
        <button className={status ? "productActive" : "productInactive"}>
          {status ? "active" : "in active"}
        </button>
      </td>
      <td>
        <button id="removebtn" type="button">
          remove
        </button>
      </td>
    </tr>
  );
};

export default Products;

import React from "react";
import { data } from "../data";
import { Link, useOutletContext } from "react-router-dom";

function Products() {
  const [setShowContent] = useOutletContext();

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
            {data.map((item) => {
              return <SingleProduct {...item} />;
            })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

const SingleProduct = ({ image, name }) => {
  const status = true;
  return (
    <tr className="tableRow">
      <td>
        <input id="checkbox" type="checkbox" />
      </td>
      <td>
        <img src={process.env.PUBLIC_URL + image} alt="Featured Product" />
      </td>
      <td id="name">{name}</td>
      <td>
        <button className={status ? "productActive" : "productInactive"}>
          {status ? "active" : "in active"}
        </button>
      </td>
      <td>Canada</td>
      <td>
        <button id="removebtn" type="button">
          remove
        </button>
      </td>
    </tr>
  );
};

export default Products;

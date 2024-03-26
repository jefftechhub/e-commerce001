import React, { useEffect, useState } from "react";
import "./DashboardCss/myOrders.css";
import { useGet } from "../useGet";
import { Link, useOutletContext } from "react-router-dom";

const stringDate = (date) => {
  const getDate = new Date(date);

  const monthString = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = getDate.getMonth();
  const day = getDate.getDate();
  const year = getDate.getFullYear();

  return `${monthString[month]} ${day}, ${year}`;
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showFullOrder, setShowFullOrder] = useState(false);
  const [singleOrder, SetSingleOrder] = useState({});
  const [id] = useOutletContext();

  const findSingleOrder = (id) => {
    const findOrder = orders.find((item) => item.orderID === id);
    console.log(findOrder);
    SetSingleOrder(findOrder);
  };

  const { loading, data, error, errorContent } = useGet(
    `/api/getMyOrders/${id}`
  );

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <div className="ordersloadingAnimationContainer">
          <p className="loadingAnimation"></p>
        </div>
      ) : (
        <div className="order_container">
          <Link to={"/dashboard"}>
            <i class="fa-solid fa-arrow-left"></i>
          </Link>
          {!orders.length > 0 ? (
            <div className="emptyOrders">
              <p>You do not have any orders</p>
              <img src="/icons/empty_orders.png" />
            </div>
          ) : (
            <div>
              {showFullOrder && (
                <div className="singleContainer">
                  <SingleOrderComp
                    {...singleOrder}
                    setShowFullOrder={setShowFullOrder}
                  />
                </div>
              )}

              <div className="orders">
                <h2 id="header">
                  <i class="fa-solid fa-truck"></i> My Orders
                </h2>
                <div>
                  <h2 id="subheading">Ongoing Orders</h2>
                  {orders.map((item) => {
                    return (
                      <SingleOrderSummary
                        {...item}
                        findSingleOrder={findSingleOrder}
                        setShowFullOrder={setShowFullOrder}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const SingleOrderSummary = ({
  orderID,
  products,
  status,
  total,
  findSingleOrder,
  setShowFullOrder,
}) => {
  return (
    <div className="singleOrderSummary">
      <div>
        <h2>Order ID: {orderID.slice(11)}</h2>
        <h2 id="noPrdoducts">No of Products: {products.length}</h2>
        <h2>
          Total: <i className="fa-solid fa-dollar-sign"></i>
          {parseInt(total).toFixed(2)}
        </h2>
        <button
          type="button"
          onClick={() => {
            findSingleOrder(orderID);
            setShowFullOrder(true);
          }}
        >
          View
        </button>
      </div>
      <div>
        <p></p>
      </div>
    </div>
  );
};

const SingleOrderComp = ({
  orderID,
  date,
  deliveryDate,
  products,
  paymentMethod,
  status,
  total,
  setShowFullOrder,
}) => {
  const orderedDate = stringDate(date);
  const dateDelivered = stringDate(deliveryDate);
  products.map((item) => {
    return console.log(item.image);
  });

  return (
    <div className="singleOrder">
      <i
        class="fa-solid fa-arrow-left"
        onClick={() => {
          setShowFullOrder(false);
        }}
      ></i>
      <header>
        <h1>Order ID: {orderID.slice(11)}</h1>
        <h2>
          Status: <span> {status} </span>
        </h2>
        <div>
          <h2>Ordered Date: {orderedDate}</h2>
          <h2>
            <i class="fa-solid fa-plane"></i>Estimated delivery Date:
            {dateDelivered}
          </h2>
        </div>
      </header>
      <main>
        {products.map((item) => {
          return (
            <div key={item.id}>
              <div>
                <img src={`/${item.image}`} />
                <h3>{item.title}</h3>
              </div>
              <div>
                <h4>
                  <i className="fa-solid fa-dollar-sign"></i>
                  {parseInt(item.price).toFixed(2)}
                </h4>
                <p>Qty:{item.quantity} </p>
              </div>
            </div>
          );
        })}
        <div>
          <h3>Total</h3>
          <h4>
            <i className="fa-solid fa-dollar-sign"></i>
            {parseInt(total).toFixed(2)}
          </h4>
        </div>
      </main>
      <div className="deliveryEnd">
        <div>
          <h3>Payment</h3>
          <h4>{paymentMethod}</h4>
        </div>
        <div>
          <h2>Delivery</h2>
          <h3>address</h3>
          <p>847 Jewess Bridge</p>
          <p>London, UK</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;

import React, { useEffect, useState } from "react";
import "./DashboardCss/myOrders.css";
import { useGet } from "../useGet";

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
  const day = getDate.getDay();
  const year = getDate.getFullYear();

  return `${monthString[month]} ${day}, ${year}`;
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showFullOrder, setShowFullOrder] = useState(false);
  const [singleOrder, SetSingleOrder] = useState({});

  const findSingleOrder = (id) => {
    const findOrder = orders.find((item) => item.orderID === id);
    SetSingleOrder(findOrder);
  };

  const { loading, data, error, errorContent } = useGet(
    "/api/getMyOrders/65f543f31cabe7a15840c32b"
  );

  useEffect(() => {
    if (data) {
      setOrders(data);
      console.log(data);
    }
  }, [data]);

  return (
    <div className="order_container">
      {!orders.length > 0 ? (
        <div className="emptyOrders">
          <p>You do not have any orders</p>
          <img src="/icons/empty_orders.png" />
        </div>
      ) : (
        <div>
          {showFullOrder && (
            <SingleOrder
              {...singleOrder}
              findSingleOrder={findSingleOrder}
              setShowFullOrder={setShowFullOrder}
            />
          )}
          <div className="orders">
            {orders.map((item) => {
              <SingleOrderSummary {...item} />;
            })}
          </div>
        </div>
      )}
    </div>
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
      <h2>Order ID: {orderID}</h2>
      <h2>Number of Products: {products.length}</h2>
      <h2>Status: {status}</h2>
      <h2>Total: {total}</h2>
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
  );
};

const SingleOrder = ({
  orderID,
  date,
  deliverDate,
  products,
  paymentMethod,
  status,
}) => {
  const orderedDate = stringDate(date);
  // const deliveryDate = stringDate(deliverDate);

  return (
    <div className="singleOrder">
      <header>
        <h1>Order ID: {orderID.slice(0, 10)}</h1>
        <h2>Status: {status}</h2>
        <div>
          <h2>Ordered Date: {orderedDate}</h2>
          <h2>Estimated deliver Date: {orderedDate}</h2>
        </div>
      </header>
      <main>
        {products.map((item) => {
          return (
            <div key={item.id}>
              <img src="" />
              <div>
                <i className="fa-solid fa-dollar-sign"></i>
                <h4>{item.price}</h4>
                <p>Qty:{item.quantity} </p>
              </div>
            </div>
          );
        })}
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

import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "./Axios";
import { FUNDING } from "@paypal/react-paypal-js";

function Paypal({ cart, idUSER, setCart, setShowThanks, totalCost }) {
  const paypalCart = cart.map((item) => {
    return {
      title: item.title,
      quantity: item.quantity,
      price: parseInt(item.price) * item.quantity,
    };
  });

  // const baseUrl = "http://localhost:5000";

  const productsDelivered = cart.map((item) => {
    return {
      image: item.image,
      title: item.title,
      quantity: item.quantity,
      price: parseInt(item.price) * item.quantity,
    };
  });

  const createOrder = (data) => {
    // Order is created on the server and the order id is returned
    return fetch("/api/my-server/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({
        cart: paypalCart,
      }),
    })
      .then((response) => response.json())
      .then((order) => {
        return order.id;
      });
  };

  const onApprove = (data) => {
    // Order is captured on the server and the response is returned to the browser
    return fetch("/api/my-server/capture-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    }).then(() => {
      try {
        axios
          .post("/api/runningOrder", {
            idUSER,
            products: productsDelivered,
            paymentMethod: "payPal",
            total: parseInt(totalCost).toFixed(2),
          })
          .then((res) => {
            if (res.data.success) {
              localStorage.removeItem("cart");
              setShowThanks(true);
              setCart([]);
            }
          });
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <PayPalButtons
      className="payPalBtn"
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      fundingSource={FUNDING.PAYPAL}
    />
  );
}

export default Paypal;

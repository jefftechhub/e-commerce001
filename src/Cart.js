import React, { useEffect, useState } from "react";
import "./Component_css/Cart.css";
import { loadStripe } from "@stripe/stripe-js";
import axios from "./Axios";
import CheckOutForm from "./CheckOutForm";
import { Elements } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";

function Cart({ cart, setCart }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [showCheck, setshowCheck] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [serviceFee, setServiceFee] = useState(0.0);
  const [shipmentFee, setShipmentFee] = useState(0.0);

  useEffect(() => {
    const calculatedTotalCost = cart.reduce(
      (total, item) => total + parseInt(item.price) * item.quantity,
      0
    );
    const total = calculatedTotalCost + serviceFee + shipmentFee;
    setTotalCost(total);
  }, [cart]);

  useEffect(() => {
    if (totalCost > 200) {
      setShipmentFee(() => {
        return (2 / 100) * totalCost;
      });
    } else {
      setShipmentFee(0);
    }
    if (totalCost > 50) {
      setServiceFee(() => {
        return (0.5 / 100) * totalCost;
      });
    } else {
      setServiceFee(0);
    }
  }, [totalCost]);

  useEffect(() => {
    axios.get("/api/config").then((res) => {
      setStripePromise(loadStripe(res.data.publishingKey));
    });
  }, []);

  const createPayment = (amount) => {
    try {
      axios.post("/api/create-payment-intent", { amount }).then((res) => {
        setClientSecret(res.data.clientSecret);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  // ordr via whatsapp

  const orderWhatsapp = () => {
    const phoneNumber = "254792415842";
    const message = encodeURIComponent("how can i help you");
    // whatsAppLink = `https://wa.me${phoneNumber}?text=${message}`;

    window.location.href = `https://wa.me${phoneNumber}?text=${message}`;
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };
  return (
    <React.Fragment>
      {!cart.length > 0 ? (
        <div className="emtyCart">
          <p>
            You have an empty cart <Link to="/shop">continue shopping</Link>{" "}
          </p>
          <img src="/icons/empty cart.png" />
        </div>
      ) : (
        <div className="cartBody">
          {showCheck && (
            <>
              {stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckOutForm setshowCheck={setshowCheck} />
                </Elements>
              )}
            </>
          )}
          <div className="cartWrapper">
            <Link to="/shop">Continue shoping</Link>

            {cart.map((item) => (
              <Card
                key={item.id}
                {...item}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
            <div className="totalextras">
              <h2>Service fee</h2>
              <p>
                <i className="fa-solid fa-dollar-sign"></i>
                {serviceFee.toFixed(2)}
              </p>
            </div>
            <div className="totalextras">
              <h2>Shipment Fee</h2>
              <p>
                <i className="fa-solid fa-dollar-sign"></i>
                {shipmentFee.toFixed(2)}
              </p>
            </div>
            <div className="total">
              <h2>Total</h2>
              <p>
                <i className="fa-solid fa-dollar-sign"></i>
                {totalCost.toFixed(2)}
              </p>
            </div>
            <button
              id="cardbtn"
              className="checkoutbtn"
              type="button"
              onClick={() => {
                createPayment(totalCost);
                setshowCheck(true);
              }}
            >
              Check out with card <i class="fa-solid fa-credit-card"></i>
            </button>
            <button
              id="paypalbtn"
              className="checkoutbtn"
              type="button"
              onClick={() => {}}
            >
              Check out with paypal<i class="fa-brands fa-paypal"></i>
            </button>
            <button
              className="checkoutbtn"
              type="button"
              onClick={() => {
                orderWhatsapp();
              }}
            >
              Order via whatsapp <i class="fa-brands fa-whatsapp"></i>
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

const Card = ({
  id,
  title,
  price,
  image,
  quantity,
  removeFromCart,
  updateQuantity,
}) => {
  const handleQuantityChange = (newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  return (
    <div className="cart">
      <img src={`http://localhost:5000/${image}`} alt={title} />
      <div className="cardQuantity">
        <i
          className="fa-solid fa-plus"
          onClick={() => {
            if (quantity > 48) {
              handleQuantityChange(49);
            } else {
              handleQuantityChange(quantity + 1);
            }
          }}
        ></i>
        <input
          type="number"
          name="values"
          value={quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
        />
        <i
          className="fa-solid fa-minus"
          onClick={() => {
            if (quantity < 2) {
              handleQuantityChange(1);
            } else {
              handleQuantityChange(quantity - 1);
            }
          }}
        ></i>
      </div>

      <h2>{title}</h2>
      <h3>
        <i className="fa-solid fa-dollar-sign"></i>
        {(quantity * price).toFixed(2)}
      </h3>
      <button type="button" onClick={() => removeFromCart(id)}>
        Remove
      </button>
    </div>
  );
};

export default Cart;

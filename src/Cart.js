import React, { useEffect, useState } from "react";
import "./Component_css/Cart.css";
import axios from "./Axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Paypal from "./Paypal";
import CardCheckOut from "./CardCheckOut";

function Cart({ cart, setCart, setShow, setLogin }) {
  const [totalCost, setTotalCost] = useState(0);
  const [serviceFee, setServiceFee] = useState(0.0);
  const [shipmentFee, setShipmentFee] = useState(0.0);
  const [whatsapplink, setWhatsappLink] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [paypalCart, setPaypalCart] = useState([]);
  const [showThanks, setShowThanks] = useState(false);
  const [userID, setUserID] = useState("");
  const [showCardCheck, setShowCardCheck] = useState(false);

  // paypal instance
  const initialOptions = {
    clientId:
      "AR38bIVkSf2QZqImp1yV23ByXRRkt209TniYwGCuuBm-F1ctbmLetV41qwarcl4vbS5jMYQTO5W8TOkj",
    currency: "USD",
    intent: "capture",
  };

  // getting users email & id and checking if logged in

  axios.defaults.withCredentials = true;
  useEffect(() => {
    try {
      setLoading(true);
      axios.get("/api/getEmail").then((res) => {
        if (res.data.success) {
          setUserEmail(res.data.data.email);
          setUserID(res.data.data.userID);
          setLoading(false);
          setLogin(true);
        } else {
          navigate("/shop");
          setLoading(false);
          setShow(true);
          setLogin(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // total cost

    const calculatedTotalCost = cart.reduce(
      (total, item) => total + parseInt(item.price) * item.quantity,
      0
    );
    const total = calculatedTotalCost + serviceFee + shipmentFee;
    setTotalCost(total);

    // getting  other fees

    if (totalCost > 10000) {
      setShipmentFee(() => {
        return (1 / 100) * totalCost;
      });
    } else {
      setShipmentFee(0);
    }
    setServiceFee(() => {
      return (0.25 / 100) * totalCost;
    });

    // paypal cart

    const payPalCart = cart.map((item) => {
      return { title: item.title, price: item.price, quantity: item.quantity };
    });

    setPaypalCart(payPalCart);

    // whatsapp link

    const phoneNumber = encodeURIComponent("+13232860934");

    // message

    let message = cart.map((item, index) => {
      return `Product: ${item.title}
              Quantity:${item.quantity} 
              Price: $${parseInt(item.price * item.quantity).toFixed(2)}
      `;
    });

    message = `
  My Address: ${userEmail}

  Hello,
  I'm interested in placing an order for the following item(s):
    
  ${message}

  Service Fee: $${serviceFee.toFixed(2)}
  Shipment Fee: $${shipmentFee.toFixed(2)}
  TOTAL: $${totalCost.toFixed(2)}

  Could you please confirm availability and provide information on  payment  and delivery options?
  `;

    message = encodeURIComponent(message);

    const link = `https://wa.me/${phoneNumber}/?text=${message}`;

    setWhatsappLink(link);
  }, [cart, userEmail]);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <React.Fragment>
        {!cart.length > 0 ? (
          <div className="emtyCart">
            {showThanks && (
              <div className="thanks">
                <div>
                  <i
                    class="fa-solid fa-x"
                    onClick={() => {
                      setShowThanks(false);
                    }}
                  ></i>
                </div>
                <p>
                  👏👏Your Payment was succesful. <br />
                  Thank you 🎉🎉 for shopping with us
                </p>
              </div>
            )}
            <p>
              Add items to cart <Link to="/shop">continue shopping</Link>{" "}
            </p>
            <img src="/icons/empty cart.png" />
          </div>
        ) : (
          <div className="cartBody">
            {showCardCheck && (
              <CardCheckOut setShowCardCheck={setShowCardCheck} />
            )}
            <div className="cartWrapper">
              <Link to="/shop" id="continueLink">
                Continue shoping
              </Link>

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
                  setShowCardCheck(true);
                }}
              >
                Check out with card <i class="fa-solid fa-credit-card"></i>
              </button>

              <Paypal
                cart={cart}
                setCart={setCart}
                setShowThanks={setShowThanks}
                idUSER={userID}
              />

              <button className="checkoutbtn" type="button">
                <a href={whatsapplink} target="_blank">
                  Order via whatsapp <i class="fa-brands fa-whatsapp"></i>
                </a>
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    </PayPalScriptProvider>
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
      <img src={image} alt={title} />
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

import React, { useState } from "react";
import "./Component_css/Cart.css";
import { countries } from "./data";

function CardCheckOut({ setShowCardCheck }) {
  const [card, setCard] = useState({
    names: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    zip: "",
    country: "",
  });
  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errorMssgNo, setErrorMssgNo] = useState(false);

  const inputs = document.querySelectorAll("#formPayment input");
  const select = document.getElementById("selectCard");

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setCard({ ...card, [name]: value });

    if (value) {
      if (e.target.classList.contains("empty")) {
        e.target.classList.remove("empty");
      }
    }
  };

  const handlesubmit = async (e) => {
    // setProcessing(true);

    try {
      e.preventDefault();
      console.log(card);
      if (
        card.names &&
        card.cardNumber &&
        card.expiryDate &&
        card.cvv &&
        card.zip &&
        card.country
      ) {
      } else {
        inputs.forEach((item) => {
          if (!item.value) {
            item.classList.add("empty");
          }
        });
        if (!select.value) {
          select.classList.add("empty");
        }
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={handlesubmit} id="formPayment">
      <div className="cancelBtn">
        <button
          type="button"
          onClick={() => {
            setShowCardCheck(false);
          }}
        >
          <i class="fa-solid fa-x"></i>
        </button>
      </div>

      <input
        type="text"
        placeholder="Card holder's name"
        name="names"
        value={card.names}
        onChange={changeHandler}
      />

      <div className="cardNumber">
        {errorMssgNo && (
          <p>
            <i class="fa-solid fa-circle-exclamation"></i>Card Number is
            incomplete
          </p>
        )}

        <input
          type="number"
          placeholder="1234 1234 1234 1234"
          name="cardNumber"
          value={card.cardNumber.slice(0, 16)}
          onChange={(e) => {
            changeHandler(e);
            setErrorMssgNo(false);
          }}
          onBlur={(e) => {
            if (card.cardNumber.length < 16) {
              setErrorMssgNo(true);
              e.target.classList.add("empty");
            }
          }}
        />
      </div>

      <div className="expiry">
        <input
          type="number"
          placeholder="MM/YY"
          name="expiryDate"
          value={card.expiryDate.slice(0, 4)}
          onChange={changeHandler}
        />

        <div className="cvv">
          <input
            type="number"
            placeholder="CVV"
            name="cvv"
            value={card.cvv.slice(0, 3)}
            onChange={changeHandler}
          />

          <img src="/icons/cvv.png" />
        </div>
      </div>

      <select
        id="selectCard"
        name="country"
        value={card.country}
        onChange={changeHandler}
      >
        <option value="">--Choose Country--</option>
        {countries.map((country) => {
          return <option value={country}> {country}</option>;
        })}
      </select>

      <input
        type="number"
        placeholder="ZIP"
        name="zip"
        value={card.zip}
        onChange={changeHandler}
      />

      <button disabled={processing} id="submit">
        <span id="btn-text">{processing ? "processing..." : "pay now"}</span>
      </button>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

export default CardCheckOut;

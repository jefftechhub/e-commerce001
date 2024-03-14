import React, { useState } from "react";
import "./Component_css/Cart.css";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";

function CheckOutForm({ setshowCheck }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });
    if (error) {
      setMessage(error.message);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handlesubmit} id="formPayment">
      <div className="cancelBtn">
        <button
          type="button"
          onClick={() => {
            setshowCheck(false);
          }}
        >
          <i class="fa-solid fa-x"></i>
        </button>
      </div>

      <PaymentElement />
      <button disabled={processing} id="submit">
        <span id="btn-text">{processing ? "processing..." : "pay now"}</span>
      </button>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

export default CheckOutForm;

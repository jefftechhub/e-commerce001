import React, { useState } from "react";
import "./Component_css/Footer.css";
import { Link } from "react-router-dom";
import axios from "./Axios";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errMessage, setErrMessgae] = useState(false);
  const [showSubmitMssg, setShowSubmitMssg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = (e) => {
    try {
      e.preventDefault();

      if (email) {
        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setMessage("Invalid email address");
          setErrMessgae(true);
          setShowSubmitMssg(true);
          setTimeout(() => {
            setShowSubmitMssg(false);
          }, 3000);

          return;
        } else {
          setLoading(true);
          axios
            .post("/api/newsletters", { email })
            .then((res) => {
              if (res.data.success) {
                setMessage(res.data.message);
                setErrMessgae(false);
                setShowSubmitMssg(true);
                setLoading(false);
                setEmail("");
                setTimeout(() => {
                  setShowSubmitMssg(false);
                }, 3000);
              } else {
                setMessage(res.data.message);
                setErrMessgae(true);
                setShowSubmitMssg(true);
                setLoading(false);
                setTimeout(() => {
                  setShowSubmitMssg(false);
                }, 3000);
              }
            })
            .catch(() => {
              setMessage("Internal server error");
              setErrMessgae(true);
              setShowSubmitMssg(true);
              setLoading(false);
              setTimeout(() => {
                setShowSubmitMssg(false);
              }, 3000);
            });
        }
      } else {
        setMessage("Provide an email address");
        setErrMessgae(true);
        setShowSubmitMssg(true);
        setTimeout(() => {
          setShowSubmitMssg(false);
        }, 3000);
      }
    } catch (error) {
      setMessage("Internal server error");
      setErrMessgae(true);
      setShowSubmitMssg(true);
      setTimeout(() => {
        setShowSubmitMssg(false);
      }, 6000);
    }
  };

  return (
    <div class="footer">
      <div class="info">
        <img className="logoFooter" src="/icons/LOGO.png" alt="logo" />
        <h2>INFORMATION</h2>
        <ul>
          <Link to="/">privacy &amp; policy</Link>
          <Link to="terms&conditions">terms &amp; conditions</Link>
          <Link to="/">manufactures</Link>
        </ul>
        <form onSubmit={submitHandler} noValidate>
          <h2>NewsLetter</h2>
          <p>Please subscribe to our Newsletter to get exclusive offers</p>

          {showSubmitMssg && (
            <p className={errMessage ? "alert alertErr" : "alert alertSucc "}>
              {errMessage ? (
                <i class="fa-solid fa-circle-exclamation"></i>
              ) : (
                <i class="fa-solid fa-circle-check"></i>
              )}
              {message}
            </p>
          )}
          <input
            type="email"
            placeholder="your email address *"
            value={email}
            onChange={handleChange}
          />

          <button type="submit">
            {loading ? "loading..." : "Send Email Address"}
          </button>
        </form>
      </div>
      <div class="reserved">
        <p>We accept</p>
        <div>
          <i class="fa-brands fa-cc-paypal"></i>
          <i class="fa-brands fa-cc-visa"></i>
          <i class="fa-brands fa-cc-mastercard"></i>
        </div>
      </div>
    </div>
  );
}

export default Footer;

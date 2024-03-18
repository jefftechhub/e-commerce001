import React from "react";
import "./Component_css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div class="footer">
      <div class="info">
        <h2>INFORMATION</h2>
        <ul>
          <Link to="/">privacy &amp; policy</Link>
          <Link to="terms&conditions">terms &amp; conditions</Link>
          <Link to="/">manufactures</Link>
        </ul>
        <form>
          <h2>NewsLetter</h2>
          <p>Please subscribe to our Newsletter to get exclusive offers</p>
          <input type="email" placeholder="your mail *" />
          <button>send mail</button>
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

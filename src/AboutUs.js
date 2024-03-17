import React from "react";
import "./Component_css/AboutUs.css";

function AboutUs() {
  return (
    <>
      <h1 id="termsHeading">About Us</h1>
      <div className="aboutuscontainer">
        <div className="aboutusImage">
          <img src="/icons/aboutus.png" />
        </div>
        <div className="aboutus">
          <p>
            The journey of Argyle Comfy Furniture began in October 2018, with a
            modest showroom of 3,500 sq. ft. Founded with a belief that
            Furniture can be sold in a better way. We aspire to grow to be
            America’s largest furniture retailer showcasing the widest range of
            home furniture, office furniture, outdoor furniture, and home decor.
            The company continues to grow, maintaining the standards of service,
            integrity and dedication established as the years rolled by. Proudly
            employing over 800 employees within our network of corporate and
            franchise stores throughout America..
          </p>
          <h2>VISION</h2>
          <p>
            To be the prominent trendsetter and the first choice for great
            furnishing needs. <br />
            <span id="iconAboutus">
              <i class="fa-solid fa-quote-left"></i> We want to serve people as
              best as we can
            </span>
          </p>
          <h2>MISSION</h2>
          <p>
            To provide a wide range of quality furnishings for all purposes with
            affordable and competitive prices, excellent value services,
            sustainable improvement, and comfortable shopping environment with
            competent staff.
          </p>
          <h2>CORE VALUES</h2>
          <p>
            <i class="fa-regular fa-circle-dot"></i> Passion for Excellence
          </p>
          <p>
            <i class="fa-regular fa-circle-dot"></i> Empowering people to strive
          </p>
          <p>
            <i class="fa-regular fa-circle-dot"></i> Adapting to changing market
          </p>
          <p>
            <i class="fa-regular fa-circle-dot"></i> Customer needs
          </p>
          <p>
            <i class="fa-regular fa-circle-dot"></i> Integrity
          </p>
        </div>
      </div>
    </>
  );
}

export default AboutUs;

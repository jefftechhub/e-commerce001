import React from "react";
import "./DashboardCss/wallPaper.css";
import { useOutletContext } from "react-router-dom";

function Wallpaper() {
  return (
    <div className="wallpaper">
      <img src="/icons/wallpaper.png" />
      <p>
        WE ARE OFFERING
        <br />
        <span>
          convenience, accessibility, and a global marketplace from the comfort
          of your fingertips.
        </span>
      </p>
    </div>
  );
}

export default Wallpaper;

import React from "react";
import { Link } from "react-router-dom";

function FixedNotification({ setShow }) {
  return (
    <div className="fixedNotificationContainer">
      <main>
        <div className="cancelBtn">
          <button
            type="button"
            onClick={() => {
              setShow(false);
            }}
          >
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
        <p>Please log in to continue.</p>
        <div className="divBtn">
          <Link
            to="/login"
            onClick={() => {
              setShow(false);
            }}
          >
            OK
          </Link>
        </div>
      </main>
    </div>
  );
}

export default FixedNotification;

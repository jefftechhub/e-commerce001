import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "./Axios";
import { useSendOTP } from "./useOTP";
import "./Component_css/Verify.css";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [showmssg, setShowMssg] = useState(false);
  const [verifying, setverifyingotp] = useState(false);
  const navigate = useNavigate();

  const {
    sendOtp,
    otpSent,
    response,
    setShowResponse,
    showResponse,
    loadingOTPSent,
  } = useSendOTP(id);

  useEffect(() => {
    sessionStorage.setItem("otpSent", otpSent);
  }, [otpSent]);

  useEffect(() => {
    if (otp.length === 4) {
      submitHandler();
    }
  }, [otp]);

  const submitHandler = () => {
    if (otp) {
      if (otp.slice(0, 4).length === 4) {
        setverifyingotp(true);
        axios
          .post("/api/verifyOtp", { id, otp })
          .then((res) => {
            if (res.data.success) {
              setMessage(res.data.message);
              setShowMssg(true);
              setverifyingotp(false);
              sessionStorage.removeItem("otpSent");
              sessionStorage.removeItem("verificationNote");
              sessionStorage.removeItem("userID");
              setTimeout(() => {
                navigate("/login");
              }, 2000);
            } else {
              setMessage(res.data.message);
              setShowMssg(true);
              setverifyingotp(false);
            }
          })
          .catch(() => {
            setverifyingotp(false);
          });
      } else {
        setMessage("verification code must be of four digits");
        setShowMssg(true);
      }
    } else {
      setMessage("input your verification code");
      setShowMssg(true);
    }
  };

  return (
    <div className="verify">
      <article>
        <img src="/icons/verify.png" />
        <main>
          <i class="fa-solid fa-envelope"></i>
          <h1>Verify your email address</h1>

          {otpSent === "true" && (
            <form>
              <h3>Verification code has been sent to your email address</h3>

              <input
                type="number"
                value={otp.slice(0, 4)}
                placeholder="OTP"
                disabled={verifying || loadingOTPSent}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setShowMssg(false);
                }}
              />
            </form>
          )}
          {showmssg && <p>{message}</p>}

          {verifying || loadingOTPSent ? (
            <button
              disabled={verifying || loadingOTPSent}
              type="button"
              onClick={() => {
                sendOtp();
              }}
            >
              <p className="spinner"></p>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sendOtp();
              }}
            >
              {otpSent === "true" ? "Resend Code" : "Send Code"}
            </button>
          )}

          <Link
            to="/"
            onClick={() => {
              sessionStorage.removeItem("otpSent");
              sessionStorage.removeItem("verificationNote");
              sessionStorage.removeItem("userID");
            }}
          >
            Verify later
          </Link>
        </main>
      </article>
    </div>
  );
}

export default VerifyEmail;

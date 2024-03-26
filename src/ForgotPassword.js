import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSendOTP } from "./useOTP";
import axios from "./Axios";
import "./Component_css/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mssg, setMssg] = useState("");
  const [showMssg, setShowMssg] = useState(false);
  const [verifyingemail, setverifyingemail] = useState(false);
  const [userID, setUserID] = useState("");
  const [otp, setotp] = useState("");
  const [verifyingotp, setverifyingotp] = useState(false);
  const [disable, setdisable] = useState(true);
  const [resetPage, setResetPage] = useState(false);
  const [showPageCode, setShowPageCode] = useState(false);
  const [showEmailform, setShowEmailform] = useState(true);

  const {
    sendOtp,
    otpSent,
    response,
    loadingOTPSent,
    setShowResponse,
    showResponse,
  } = useSendOTP(userID);

  useEffect(() => {
    if (otp.length === 4) {
      setdisable(true);
      submitOTP();
    }
  }, [otp]);

  useEffect(() => {
    if (otpSent === "true") {
      setdisable(false);
    } else {
      setdisable(true);
    }
  }, [otpSent]);

  const submitEmailHandler = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email) {
      if (!emailRegex.test(email)) {
        setMssg("Invalid email address");
        setShowMssg(true);
      } else {
        setverifyingemail(true);
        axios.post("/api/verifyEmail", { email }).then((res) => {
          if (res.data.success) {
            setUserID(res.data.userID);
            setverifyingemail(false);
            setShowEmailform(false);
            setShowPageCode(true);
          } else {
            setMssg(res.data.message);
            setverifyingemail(false);
            setShowMssg(true);
          }
        });
      }
    } else {
      setMssg("empty field");
      setShowMssg(true);
    }
  };

  const submitOTP = (e) => {
    try {
      if (otpSent === "true") {
        setverifyingotp(true);

        axios
          .post("/api/verifyOtp", { id: userID, otp })
          .then((res) => {
            if (res.data.success) {
              setotp("false");
              setdisable(true);
              setverifyingotp(false);
              setShowEmailform(false);
              setShowPageCode(false);
              setResetPage(true);
            } else {
              setMssg(res.data.message);
              setdisable(false);
              setShowMssg(true);
              setverifyingotp(false);
            }
          })
          .catch(() => {});
      }
    } catch (error) {}
  };

  // reset password function

  const [password, setPassword] = useState({
    newPassword: "",
    confirmPass: "",
  });
  const [resetMssg, setResetMssg] = useState("");
  const [showResetMesssage, setShowResetMessage] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const navigate = useNavigate();

  const changeReset = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setShowResetMessage(false);

    if (value) {
      if (e.target.classList.contains("empty")) {
        e.target.classList.remove("empty");
      }
    }

    setPassword({ ...password, [name]: value });
  };

  const [newPass, setNewPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);

  const inputs = document.querySelectorAll("input");

  function togglePasswordVisibility(e) {
    const input = e.target.previousElementSibling;
    if (input && input.type === "password") {
      input.type = "text";
    } else if (input && input.type === "text") {
      input.type = "password";
    }
  }

  const submitReset = (e) => {
    try {
      e.preventDefault();
      if (password.newPassword && password.confirmPass) {
        if (password.newPassword === password.confirmPass) {
          try {
            setLoadingReset(true);
            axios
              .post("/api/resetPassword", {
                password: password.newPassword,
                id: userID,
              })
              .then((res) => {
                if (res.data.success) {
                  setResetMssg(res.data.message);
                  setShowResetMessage(true);
                  setLoadingReset(false);
                  setPassword({
                    newPassword: "",
                    confirmPass: "",
                  });
                  setTimeout(() => {
                    navigate("/login");
                  }, 2000);
                } else {
                  setResetMssg(res.data.message);
                  setShowResetMessage(true);
                  setLoadingReset(false);
                }
              })
              .catch((err) => {
                setResetMssg("internal server error");
                setShowResetMessage(true);
                setLoadingReset(false);
              });
          } catch (error) {
            setResetMssg("internal server error");
            setShowResetMessage(true);
            setLoadingReset(false);
          }
        } else {
          setResetMssg("password do not match");
          setShowResetMessage(true);
        }
      } else {
        inputs.forEach((item) => {
          if (!item.value) {
            setResetMssg("empty field");
            setShowResetMessage(true);
            item.classList.add("empty");

            return;
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="forgotPassword">
      <main>
        <img src="/icons/forgotpassword.png" />

        {/* provide email address  */}
        <div>
          <h1>Reset Password</h1>

          {showEmailform && (
            <form noValidate onSubmit={submitEmailHandler}>
              <label for="email">Your email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShowMssg(false);
                }}
              />
              {showMssg && <p>{mssg}</p>}

              <button type="submit" disabled={verifyingemail}>
                {verifyingemail ? <p className="spinner"></p> : "send"}
              </button>
            </form>
          )}

          {/* verify otp  */}
          {showPageCode && (
            <div>
              <label for="otp">Verification code</label>
              <input
                type="number"
                disabled={disable}
                onChange={(e) => {
                  setotp(e.target.value);
                }}
              />

              {otpSent === "true" ? (
                <button
                  type="button"
                  onClick={() => {
                    sendOtp();
                  }}
                >
                  <p>
                    {verifyingotp || loadingOTPSent ? (
                      <p className="spinner"></p>
                    ) : (
                      "Resend code"
                    )}
                  </p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sendOtp();
                  }}
                >
                  <p>
                    {verifyingotp || loadingOTPSent ? (
                      <p className="spinner"></p>
                    ) : (
                      "Send code"
                    )}
                  </p>
                </button>
              )}

              {showMssg && <p>{mssg}</p>}

              {showResponse && (
                <ResponseMssg
                  response={response}
                  setShowResponse={setShowResponse}
                />
              )}
            </div>
          )}

          {/* input new password  */}

          {resetPage && (
            <form onSubmit={submitReset} className="formresetField">
              <label for="newPassword">New Password</label>
              <div>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={changeReset}
                />
                {newPass ? (
                  <i
                    class="fa-solid fa-eye-slash"
                    onClick={(e) => {
                      togglePasswordVisibility(e);
                      setNewPass(false);
                    }}
                  ></i>
                ) : (
                  <i
                    class="fa-solid fa-eye"
                    onClick={(e) => {
                      togglePasswordVisibility(e);
                      setNewPass(true);
                    }}
                  ></i>
                )}
              </div>
              <label for="confirmPass">confirm password</label>
              <div>
                <input
                  id="confirmPass"
                  type="password"
                  name="confirmPass"
                  value={password.confirmPass}
                  onChange={changeReset}
                />
                {confirmPass ? (
                  <i
                    class="fa-solid fa-eye-slash"
                    onClick={(e) => {
                      togglePasswordVisibility(e);
                      setConfirmPass(false);
                    }}
                  ></i>
                ) : (
                  <i
                    class="fa-solid fa-eye"
                    onClick={(e) => {
                      togglePasswordVisibility(e);
                      setConfirmPass(true);
                    }}
                  ></i>
                )}
              </div>
              {showResetMesssage && <p>{resetMssg}</p>}

              <button type="submit">
                {loadingReset ? <p className="spinner"></p> : "submit"}
              </button>
            </form>
          )}
          {otpSent === "false" && <Link to="/login">Continue to log in</Link>}
        </div>
      </main>
    </div>
  );
}

const ResponseMssg = ({ response, setShowResponse }) => {
  setTimeout(() => {
    setShowResponse(false);
  }, 4000);
  return <p>{response}</p>;
};

export default ForgotPassword;

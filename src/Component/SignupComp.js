import React, { useState } from "react";
import { Link } from "react-router-dom";
import PopNotification from "../PopNotifiction";

function SignupComp(props) {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    submitHandler,
    changeHandler,
    showNote,
    setShowNote,
    noteContent,
    errorNote,
    loading,
  } = props;
  const [passShow, setPassShow] = useState(false);
  const [confirnPassShow, setConfirmShow] = useState(false);

  function togglePasswordVisibility(e) {
    const input = e.target.previousElementSibling;
    if (input && input.type === "password") {
      input.type = "text";
    } else if (input && input.type === "text") {
      input.type = "password";
    }
  }

  return (
    <div className="containerSignup">
      <nav>
        <img src="/subLOGO.png" alt="logo" />
      </nav>
      <main>
        <img src="/icons/signup.png" />
        <form onSubmit={submitHandler} noValidate>
          <h1>Register</h1>
          {showNote && (
            <PopNotification
              noteContent={noteContent}
              setShowNote={setShowNote}
              errorNote={errorNote}
            />
          )}

          <div className="namesDiv">
            <div>
              <label for="firstName">first name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={firstName}
                onChange={changeHandler}
                autocomplete="off"
              />
            </div>
            <div>
              <label for="lastName">last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={lastName}
                onChange={changeHandler}
                autocomplete="off"
              />
            </div>
          </div>

          <label for="email">email address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={changeHandler}
            autocomplete="off"
          />

          <label for="password">Password</label>
          <div className="input-container">
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={changeHandler}
              autocomplete="off"
            />

            {passShow ? (
              <i
                class="fa-solid fa-eye-slash"
                onClick={(e) => {
                  togglePasswordVisibility(e);
                  setPassShow(false);
                }}
              ></i>
            ) : (
              <i
                class="fa-solid fa-eye"
                onClick={(e) => {
                  togglePasswordVisibility(e);
                  setPassShow(true);
                }}
              ></i>
            )}
          </div>

          <label for="confirmPassword">confirm password</label>
          <div className="input-container">
            <input
              id="cornfirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={changeHandler}
              autocomplete="off"
            />
            {confirnPassShow ? (
              <i
                class="fa-solid fa-eye-slash"
                onClick={(e) => {
                  togglePasswordVisibility(e);
                  setConfirmShow(false);
                }}
              ></i>
            ) : (
              <i
                class="fa-solid fa-eye"
                onClick={(e) => {
                  togglePasswordVisibility(e);
                  setConfirmShow(true);
                }}
              ></i>
            )}
          </div>

          <button disabled={loading} type="submit">
            {loading ? "loading..." : "Sign up"}
          </button>

          <p>
            Already have an account? <Link to="/login">log in</Link>
          </p>

          <div className="signupLinks">
            <Link to="/">Continue without signing up</Link>

            <p>
              By clicking sign up, you agree to our Terms and Conditions and
              Privacy Policies
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SignupComp;

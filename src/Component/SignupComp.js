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
      <Link to="/" id="homeink">
        home
      </Link>
      <form onSubmit={submitHandler} noValidate>
        {showNote && (
          <PopNotification
            noteContent={noteContent}
            setShowNote={setShowNote}
            errorNote={errorNote}
          />
        )}
        <label for="firstName">first name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={changeHandler}
          autocomplete="off"
        />

        <label for="lastName">last name</label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={changeHandler}
          autocomplete="off"
        />

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

        <button type="submit">sign up</button>
        <Link to="/login">Already have an account?</Link>
      </form>
    </div>
  );
}

export default SignupComp;

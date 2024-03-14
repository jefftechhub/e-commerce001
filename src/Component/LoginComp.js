import React, { useState } from "react";
import { Link } from "react-router-dom";
import PopNotifiction from "../PopNotifiction";
import Loading from "../Loading";

function LoginComp(props) {
  const {
    email,
    password,
    submitHandler,
    changeHandler,
    showNote,
    setShowNote,
    noteContent,
    errorNote,
    loading,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility(e) {
    const input = e.target.previousElementSibling;
    if (input && input.type === "password") {
      input.type = "text";
    } else if (input && input.type === "text") {
      input.type = "password";
    }
  }

  return (
    <div className="containerLogin">
      <Link to="/" id="homeink">
        home
      </Link>
      <form noValidate onSubmit={submitHandler}>
        {showNote && (
          <PopNotifiction
            setShowNote={setShowNote}
            noteContent={noteContent}
            errorNote={errorNote}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={changeHandler}
          autocomplete="off"
        />

        <div className="input-container">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={changeHandler}
            autocomplete="off"
          />

          {showPassword ? (
            <i
              class="fa-solid fa-eye-slash"
              onClick={(e) => {
                togglePasswordVisibility(e);
                setShowPassword(false);
              }}
            ></i>
          ) : (
            <i
              class="fa-solid fa-eye"
              onClick={(e) => {
                togglePasswordVisibility(e);
                setShowPassword(true);
              }}
            ></i>
          )}
        </div>

        <button disabled={loading} type="submit">
          {loading ? "loading..." : "Log in"}
        </button>

        <div className="loginLinks">
          <Link>Forgot password?</Link>
          <Link to="/signup">Don't have an account?</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginComp;

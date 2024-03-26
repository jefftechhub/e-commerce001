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
      <nav>
        <img src="/subLOGO.png" alt="logo" />
      </nav>
      <main>
        <img src="/icons/login.png" />
        <form noValidate onSubmit={submitHandler}>
          {showNote && (
            <PopNotifiction
              setShowNote={setShowNote}
              noteContent={noteContent}
              errorNote={errorNote}
            />
          )}
          <h1>Log in</h1>
          <h2>Glad to see you again!</h2>

          <div>
            <i class="fa-solid fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={changeHandler}
              autocomplete="off"
            />
          </div>

          <div className="passwordField">
            <i class="fa-solid fa-lock"></i>
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

          <Link to="/forgotPassword">Forgot password?</Link>

          <div className="loginLinks">
            <p>
              Don't have an account yet?
              <Link to="/signup">Create an account</Link>
            </p>
            <Link to="/">Continue without logging in</Link>

            <p>
              By logging in, you agree to our Terms and Conditions and Privacy
              Policies
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default LoginComp;

import React, { useState } from "react";
import LoginComp from "./Component/LoginComp";
import "./Component_css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "./Axios";

function Login({ setLogin }) {
  sessionStorage.removeItem("otpSent");

  const navigate = useNavigate();
  const [userValues, setUserValues] = useState({
    email: "",
    password: "",
  });

  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [errorNote, setErrorNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyNote, setVerifyNote] = useState(false);
  const [verifyNoteMssg, setVerifyNoteMssg] = useState("");
  const [userID, setUserID] = useState("");

  const inputs = document.querySelectorAll("input");

  const changeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (value) {
      if (e.target.classList.contains("empty")) {
        e.target.classList.remove("empty");
      }
    }

    setUserValues({ ...userValues, [name]: value });
  };

  axios.defaults.withCredentials = true;

  const submitHandler = (e) => {
    e.preventDefault();
    // check if all the inputs is filled
    if (userValues.email && userValues.password) {
      // Check if the email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userValues.email)) {
        setNoteContent("Invalid email address");
        setShowNote(true);
        setErrorNote(true);
        return;
      } else {
        try {
          setLoading(true);

          axios
            .post("/api/auth", userValues)
            .then((res) => {
              if (res.data.login) {
                setUserValues({
                  email: "",
                  password: "",
                });
                setLoading(false);
                setLogin(true);
                navigate("/");

                return;
              }

              if (!res.data.success) {
                setLoading(false);
                setNoteContent(res.data.message);
                setShowNote(true);
                setErrorNote(true);

                return;
              }

              if (!res.data.verify) {
                setUserID(res.data.userID);
                setVerifyNoteMssg(res.data.message);
                setLoading(false);
                setVerifyNote(true);

                return;
              }
            })
            .catch((error) => {
              console.log(error);
              setNoteContent("internal server error");
              setLoading(false);
              setShowNote(true);
              setErrorNote(true);
              return;
            });
          return;
        } catch (error) {
          setNoteContent("error");
          setShowNote(true);
          setErrorNote(true);
        }
      }
    } else {
      inputs.forEach((item) => {
        if (!item.value) {
          setNoteContent("empty field");
          setShowNote(true);
          item.classList.add("empty");
          setErrorNote(true);
          return;
        }
      });
    }
  };

  return (
    <>
      {verifyNote && (
        <div className="verifyNote">
          <div>
            <button
              type="button"
              onClick={() => {
                setVerifyNote(false);
              }}
            >
              not now
            </button>
            <p>{verifyNoteMssg}</p>

            <Link to={`/verifyEmail/${userID}`}>ok</Link>
          </div>
        </div>
      )}
      <LoginComp
        {...userValues}
        loading={loading}
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        showNote={showNote}
        setShowNote={setShowNote}
        noteContent={noteContent}
        errorNote={errorNote}
      />
    </>
  );
}

export default Login;

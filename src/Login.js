import React, { useState } from "react";
import LoginComp from "./Component/LoginComp";
import "./Component_css/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "./Axios";

function Login({ setLogin }) {
  const navigate = useNavigate();
  const [userValues, setUserValues] = useState({
    email: "",
    password: "",
  });

  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [errorNote, setErrorNote] = useState(false);

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
          axios
            .post("/api/auth", userValues)
            .then((res) => {
              if (res.data.login) {
                setUserValues({
                  email: "",
                  password: "",
                });
                setLogin(true);
                navigate("/");
              } else {
                setNoteContent(res.data.message);
                setShowNote(true);
                setErrorNote(true);
              }
            })
            .catch((error) => {
              console.log(error);
              setNoteContent("internal server error");
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
    <LoginComp
      {...userValues}
      submitHandler={submitHandler}
      changeHandler={changeHandler}
      showNote={showNote}
      setShowNote={setShowNote}
      noteContent={noteContent}
      errorNote={errorNote}
    />
  );
}

export default Login;

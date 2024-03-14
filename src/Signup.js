import React, { useState } from "react";
import SignupComp from "./Component/SignupComp";
import "./Component_css/Signup.css";
import axios from "./Axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [userValues, setUserValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [errorNote, setErrorNote] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (
      userValues.firstName &&
      userValues.lastName &&
      userValues.email &&
      userValues.password &&
      userValues.confirmPassword
    ) {
      // Check if the email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(userValues.email)) {
        setNoteContent("Invalid email address");
        setShowNote(true);
        setErrorNote(true);

        return;
      } else {
        // if passwords match
        if (userValues.password === userValues.confirmPassword) {
          const userDataToSubmit = {
            firstName: userValues.firstName,
            lastName: userValues.lastName,
            email: userValues.email,
            password: userValues.password,
          };
          try {
            setLoading(true);
            axios
              .post("/api/signup", userDataToSubmit)

              .then((res) => {
                if (res.data.success) {
                  setUserValues({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });

                  setNoteContent(res.data.message);
                  setLoading(false);
                  setShowNote(true);
                  setErrorNote(false);

                  // navigate("/login");
                } else {
                  setNoteContent(res.data.message);
                  setLoading(false);
                  setShowNote(true);
                  setErrorNote(true);
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
        } else {
          setNoteContent("passwords don't match");
          setShowNote(true);
          setErrorNote(true);

          return;
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
    <SignupComp
      {...userValues}
      loading={loading}
      submitHandler={submitHandler}
      changeHandler={changeHandler}
      showNote={showNote}
      setShowNote={setShowNote}
      noteContent={noteContent}
      errorNote={errorNote}
    />
  );
}

export default Signup;

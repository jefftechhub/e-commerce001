import React, { useState } from "react";
import "./Component_css/Contactus.css";
import PopNotification from "./PopNotifiction";
import axios from "./Axios";

function Contactus() {
  const [contacts, setContancts] = useState({
    names: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [errorNote, setErrorNote] = useState(false);

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setContancts({ ...contacts, [name]: value });
  };

  const submitHandler = (e) => {
    try {
      e.preventDefault();
      console.log(contacts);
      if (
        contacts.email &&
        contacts.message &&
        contacts.names &&
        contacts.phone &&
        contacts.subject
      ) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(contacts.email)) {
          setNoteContent("Invalid email address");
          setShowNote(true);
          setErrorNote(true);

          return;
        } else {
          axios.post("/api/contactus", contacts).then((res) => {
            if (res.data.success) {
              setNoteContent("Message submitted successfully");
              setErrorNote(false);
              setShowNote(true);
              setContancts({
                names: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
              });
            }
          });
        }
      } else {
        setNoteContent("Fill in all the field");
        setErrorNote(true);
        setShowNote(true);
      }
    } catch (error) {
      setNoteContent("Internal server error");
      setErrorNote(true);
      setShowNote(true);
    }
  };

  return (
    <>
      <h1 id="termsHeading">Lets Talk</h1>
      <div className="contactusContainer">
        <div className="contactusImage">
          <img src="/icons/contactus.png" />
        </div>
        <form className="contactus" onSubmit={submitHandler} noValidate>
          {showNote && (
            <PopNotification
              setShowNote={setShowNote}
              noteContent={noteContent}
              errorNote={errorNote}
            />
          )}
          <label for="names">Your Name *</label>
          <input
            id="names"
            type="text"
            value={contacts.names}
            name="names"
            onChange={changeHandler}
          />
          <label for="emailContact">Your Email *</label>
          <input
            id="emailContact"
            type="email"
            value={contacts.email}
            name="email"
            onChange={changeHandler}
          />
          <label for="phone">Your Phone *</label>
          <input
            id="phone"
            type="number"
            value={contacts.phone}
            name="phone"
            onChange={changeHandler}
          />
          <label for="subject">Your Subject *</label>
          <input
            id="subject"
            type="text"
            value={contacts.subject}
            name="subject"
            onChange={changeHandler}
          />
          <label for="textarea">Your Message *</label>
          <textarea
            id="textarea"
            value={contacts.message}
            name="message"
            onChange={changeHandler}
          />
          <button type="submit">submit</button>
        </form>
      </div>
    </>
  );
}

export default Contactus;

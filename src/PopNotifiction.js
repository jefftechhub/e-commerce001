import React from "react";

function PopNotifiction({ noteContent, setShowNote, errorNote }) {
  setTimeout(() => {
    setShowNote(false);
  }, 4000);

  return (
    <div className={`popNotification ${errorNote ? "errorNote" : "success"}`}>
      {/* {errorNote ? (
        <i class="fa-solid fa-exclamation"></i>
      ) : (
        <i class="fa-solid fa-check"></i>
      )} */}
      <p>{noteContent}</p>
      {/* <i
        class="fa-solid fa-x"
        onClick={() => {
          setShowNote(false);
        }}
      ></i> */}
    </div>
  );
}

export default PopNotifiction;

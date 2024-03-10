import React from "react";

function PopNotifiction({ noteContent, setShowNote, errorNote }) {
  setTimeout(() => {
    setShowNote(false);
  }, 3000);

  return (
    <div className={`popNote ${errorNote ? "errorNote" : "success"}`}>
      <p>
        {errorNote ? (
          <i class="fa-solid fa-exclamation"></i>
        ) : (
          <i class="fa-solid fa-check"></i>
        )}

        {noteContent}
        <i
          class="fa-solid fa-x"
          onClick={() => {
            setShowNote(false);
          }}
        ></i>
      </p>
    </div>
  );
}

export default PopNotifiction;

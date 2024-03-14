import React, { useEffect, useState } from "react";
import axios from "../Axios";
import "./DashboardCss/Users.css";
import PopNotification from "../PopNotifiction";
import Loading from "../Loading";

function Users() {
  const [loading, setLoading] = useState();
  const [users, setUsers] = useState([]);

  const [showNote, setShowNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [errorNote, setErrorNote] = useState(false);

  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  useEffect(() => {
    try {
      setLoading(true);

      axios.get("/api/users").then((res) => {
        if (res.data.data) {
          setUsers(res.data.data);
          setLoading(false);
        }
      });
    } catch (error) {
      setErrorContent("internal server error");
      setLoading(false);
      setError(true);
    }
  }, []);
  if (loading) {
    return <Loading />;
  } else {
    return (
      <React.Fragment>
        {showNote && (
          <PopNotification
            errorNote={errorNote}
            noteContent={noteContent}
            setShowNote={setShowNote}
          />
        )}
        <div className="userContent">
          {users.map((user) => {
            return (
              <User
                {...user}
                setShowNote={setShowNote}
                setNoteContent={setNoteContent}
                setErrorNote={setErrorNote}
              />
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

const User = ({
  firstName,
  lastName,
  email,
  status,
  id,
  accountType,
  setShowNote,
  setNoteContent,
  setErrorNote,
}) => {
  const [value, setValue] = useState({ accountType: "" });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const deactivate = (id) => {
    try {
      setLoadingStatus(true);
      axios.put(`/api/status/${id}`).then((res) => {
        if (res.data.success) {
          setLoadingStatus(false);
          setNoteContent(res.data.message);
          setErrorNote(false);
          setShowNote(true);
        }
      });
    } catch (error) {
      setLoadingStatus(false);
      setNoteContent("internal server error");
      setErrorNote(true);
      setShowNote(true);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValue({ ...value, [name]: value });
  };

  const submitHandler = (e, id) => {
    try {
      setLoadingSubmit(true);
      e.preventDefault();

      if (value.accountType) {
        axios.put(`/api/updateAccount/${id}`, value).then((res) => {
          if (res.data.success) {
            setLoadingSubmit(false);
            setNoteContent(res.data.message);
            setErrorNote(false);
            setShowNote(true);
            setValue({
              accountType: "",
            });
          }
        });
      } else {
        setLoadingSubmit(false);
        setNoteContent("empty field");
        setErrorNote(true);
        setShowNote(true);
      }
    } catch (error) {
      setLoadingSubmit(false);
      setNoteContent("internal server error");
      setErrorNote(true);
      setShowNote(true);
    }
  };

  return (
    <main>
      <h2>
        {firstName} {lastName}
      </h2>
      <h3>{email}</h3>
      <h3>{accountType}</h3>

      <h3>{status ? "active" : "inactive"}</h3>
      <form
        onSubmit={(e) => {
          submitHandler(e, id);
        }}
      >
        <select
          name="accountType"
          value={value.accountType}
          onChange={handleChange}
        >
          <option value="">--choose account type--</option>
          <option value="customer">customer</option>
          <option value="admin">admin</option>
        </select>
        {loadingSubmit ? (
          <p>loading...</p>
        ) : (
          <button type="submit">Change account type</button>
        )}
      </form>

      {loadingStatus ? (
        <p>loading...</p>
      ) : (
        <button
          type="button"
          onClick={() => {
            deactivate(id);
          }}
        >
          {status ? "Deactivate" : "Activate"}
        </button>
      )}
    </main>
  );
};

export default Users;

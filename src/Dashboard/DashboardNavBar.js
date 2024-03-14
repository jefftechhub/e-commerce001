import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import CustomerDashBoard from "./CustomerDashboard";
import AdminDashBoard from "./AdminDashBoard";
import OwnerDashBoard from "./OwnerDashboard";
import axios from "../Axios";
import { useNavigate } from "react-router-dom";
import "./DashboardCss/DashBoardNavBar.css";
import Loading from "../Loading";

function DashBoardNavBar({ setShow, setLogin }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    try {
      setLoading(true);
      axios
        .get("/api/dashboard")
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data);
            setLoading(false);
            return;
          } else {
            setLoading(false);
            setLogin(false);
            navigate("/");
            setShow(true);
            return;
          }
        })
        .catch((error) => {
          console.log(error);
          setErrorContent("internal server error");
          setLoading(false);
          setError(true);
          return;
        });
      return;
    } catch (error) {
      setErrorContent("couldn't load the page");
      setLoading(false);
      setError(true);
      return;
    }
  }, []);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <h3>{errorContent}</h3>;
  } else {
    if (user.accountType === "owner") {
      return <OwnerDashBoard {...user} />;
    } else if (user.accountType === "admin") {
      return <AdminDashBoard {...user} />;
    } else {
      return <CustomerDashBoard {...user} />;
    }
  }
}

export default DashBoardNavBar;

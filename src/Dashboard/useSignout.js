import { useNavigate } from "react-router-dom";
import axios from "../Axios";

export const useSignOut = () => {
  const navigate = useNavigate();

  const logOut = () => {
    axios
      .get("/api/logout")
      .then((res) => {
        if (!res.data.success) {
          navigate("dashboard");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("internal server error", err);
      });
  };

  return { logOut };
};

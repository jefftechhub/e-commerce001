import { useNavigate } from "react-router-dom";
import axios from "../Axios";

export const useSignOut = () => {
  const navigate = useNavigate();

  const logOut = () => {
    axios
      .post("/api/logout")
      .then((res) => {
        if (!res.data.success) {
          console.log(res.data.message);
          navigate("/");
        } else if (res.data.login) {
          console.log(res.data.message);
        } else if (!res.data.login) {
          console.log(res.data.message);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("internal server error", err);
      });
  };

  return { logOut };
};

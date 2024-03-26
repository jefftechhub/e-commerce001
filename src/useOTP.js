import { useState } from "react";
import axios from "./Axios";

export const useSendOTP = (id) => {
  const [response, setResponse] = useState("");
  const [otpSent, setOtPSent] = useState(
    sessionStorage.getItem("otpSent") || "false"
  );
  const [loadingOTPSent, setLoadingOTPSent] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const sendOtp = () => {
    try {
      setLoadingOTPSent(true);
      axios
        .get(`/api/sendOTP/${id}`)
        .then((res) => {
          setResponse(res.data.message);
          setOtPSent("true");
          setShowResponse(true);
          setLoadingOTPSent(false);
        })
        .catch((err) => {
          setResponse("internal server error");
          setOtPSent("false");
          setLoadingOTPSent(false);
        });
    } catch (error) {
      console.log(error);
      setResponse("internal server error");
      setOtPSent("false");
      setLoadingOTPSent(false);
    }
  };

  return {
    sendOtp,
    otpSent,
    setShowResponse,
    showResponse,
    response,
    loadingOTPSent,
  };
};

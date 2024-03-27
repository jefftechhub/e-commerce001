import { useState, useEffect } from "react";
import axios from "./Axios";

export const useGet = (path) => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState(null);

  const [error, setError] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  useEffect(() => {
    try {
      setLoading(true);

      axios
        .get(path)
        .then((res) => {
          if (res.data.data) {
            setData(res.data.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      setErrorContent("internal server error");
      setLoading(false);
      setError(true);
    }
  }, []);

  return { loading, data, error, errorContent };
};

export const useFeatured = () => {
  const [loadingFeatured, setLoadingFeatured] = useState();
  const [dataFeatured, setDataFeatured] = useState(null);

  const [errorFeatured, setErrorFeatured] = useState(false);
  const [errorContentFeatured, setErrorContentFeatured] = useState("");
  useEffect(() => {
    try {
      setLoadingFeatured(true);

      axios
        .get("/api/featuredProduct")
        .then((res) => {
          if (res.data.data) {
            setDataFeatured(res.data.data);
            setLoadingFeatured(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      setErrorContentFeatured("internal server error");
      setLoadingFeatured(false);
      setErrorFeatured(true);
    }
  }, []);

  return { loadingFeatured, dataFeatured, errorFeatured, errorContentFeatured };
};

export const useOffer = () => {
  const [loadingOffer, setLoadingOffer] = useState();
  const [dataOffer, setDataOffer] = useState(null);

  const [errorOffer, setErrorOffer] = useState(false);
  const [errorContentOffer, setErrorContentOffer] = useState("");

  useEffect(() => {
    try {
      setLoadingOffer(true);

      axios
        .get("/api/offerProducts")
        .then((res) => {
          if (res.data.data) {
            setDataOffer(res.data.data);
            setLoadingOffer(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      setErrorContentOffer("internal server error");
      setLoadingOffer(false);
      setErrorOffer(true);
    }
  }, []);

  return { loadingOffer, dataOffer, errorOffer, errorContentOffer };
};

export const useTopProducts = () => {
  const [loadingTop, setLoadingTop] = useState();
  const [dataTop, setDataTop] = useState(null);

  const [errorTop, setErrorTop] = useState(false);
  const [errorContentTop, setErrorContentTop] = useState("");

  useEffect(() => {
    try {
      setLoadingTop(true);

      axios
        .get("/api/topProducts")
        .then((res) => {
          if (res.data.data) {
            setDataTop(res.data.data);
            setLoadingTop(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      setErrorContentTop("internal server error");
      setLoadingTop(false);
      setErrorTop(true);
    }
  }, []);

  return { loadingTop, dataTop, errorTop, errorContentTop };
};

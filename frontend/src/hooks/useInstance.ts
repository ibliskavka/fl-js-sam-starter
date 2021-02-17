import { useContext, useEffect, useState } from "react";
import { IProfileRegion } from "../api-interfaces";
import AppContext from "../contexts/AppContext";

export const useInstance = (req: IProfileRegion) => {
  const context = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    function fetchData() {
      setResult([]);
      setLoading(true);

      context.api
        .listInstances(req)
        .then((c) => setResult(c))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }

    setError(null);

    if (req.profile && req.region) {
      fetchData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req.profile, req.region]);

  return {
    error,
    loading,
    result,
  };
};

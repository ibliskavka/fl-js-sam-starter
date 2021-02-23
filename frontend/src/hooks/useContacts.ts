import { useContext, useEffect, useState } from "react";
import { IContact } from "../api-interfaces";
import AppContext from "../contexts/AppContext";

/**
 * ts is simply used to refresh the hook
 */
export const useContacts = (ts: Date) => {
  const context = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<IContact[]>([]);
  const [error, setError] = useState("");

  function fetchData() {
    setError(null);
    setResult([]);
    setLoading(true);

    context.api
      .listContacts()
      .then((c) => setResult(c))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData();
  }, [ts]);

  return {
    error,
    loading,
    result,
  };
};

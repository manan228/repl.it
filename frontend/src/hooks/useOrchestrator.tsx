import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ORCHESTRATOR_URL } from "../constants";

const useOrchestrator = () => {
  const [podCreated, setPodCreated] = useState(false);
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId") ?? "";

  useEffect(() => {
    if (replId) {
      axios
        .post(`${ORCHESTRATOR_URL}`, { replId })
        .then(() => setPodCreated(true))
        .catch((err) => console.error(err));
    }
  }, [replId]);

  return podCreated;
};

export default useOrchestrator;

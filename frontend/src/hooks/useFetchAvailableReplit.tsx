import axios from "axios";
import { useEffect, useState } from "react";
import { GET_AVAILABLE_REPLIT } from "../constants";

interface Folder {
  Prefix: string;
}

const useFetchAvailableReplit = () => {
  const [availabelReplit, setAvailableReplit] = useState<Folder[]>([]);
  useEffect(() => {
    fetchAvailableReplit();
  }, []);

  const fetchAvailableReplit = async () => {
    try {
      const {
        data: { availabelReplit },
      } = await axios.get(`${GET_AVAILABLE_REPLIT}`);

      setAvailableReplit(availabelReplit);
    } catch (error) {
      console.log(error);
    }
  };

  return availabelReplit;
};

export default useFetchAvailableReplit;

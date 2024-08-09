import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { SOCKET_URL } from "../constants";

const useSocket = (replId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(
      `${SOCKET_URL.part_one}${replId}${SOCKET_URL.part_two}`
    );
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [replId]);

  return socket;
};

export default useSocket;

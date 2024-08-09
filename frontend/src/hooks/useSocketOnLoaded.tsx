import { useEffect, useState } from "react";
import { RemoteFile } from "../components/external/editor/utils/file-manager";
import { Socket } from "socket.io-client";

const useSocketOnLoaded = (
  socket: Socket | null,
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>
) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
        setLoaded(true);
        setFileStructure(rootContent);
      });
    }
  }, [socket, setFileStructure]);

  return loaded;
};

export default useSocketOnLoaded;

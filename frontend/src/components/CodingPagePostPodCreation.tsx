import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { Editor } from "./Editor";
import { File, RemoteFile, Type } from "./external/editor/utils/file-manager";
import { Output } from "./Output";
import { TerminalComponent as Terminal } from "./Terminal";
import useSocket from "../hooks/useSocket";
import useSocketOnLoaded from "../hooks/useSocketOnLoaded";

const CodingPagePostPodCreation = () => {
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId") ?? "";
  const socket = useSocket(replId);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [showOutput, setShowOutput] = useState(false);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const loaded = useSocketOnLoaded(socket, setFileStructure);

  const onSelect = (file: File) => {
    if (file.type === Type.DIRECTORY) {
      socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
        setFileStructure((prev) => {
          const allFiles = [...prev, ...data];
          return allFiles.filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.path === file.path)
          );
        });
      });
    } else {
      socket?.emit("fetchContent", { path: file.path }, (data: string) => {
        file.content = data;
        setSelectedFile(file);
      });
    }
  };

  return (
    <>
      {!loaded ? (
        "Loading"
      ) : (
        <Container>
          <ButtonContainer>
            <button onClick={() => setShowOutput(!showOutput)}>
              See output
            </button>
          </ButtonContainer>
          <Workspace>
            <LeftPanel>
              <Editor
                socket={socket}
                selectedFile={selectedFile}
                onSelect={onSelect}
                files={fileStructure}
              />
            </LeftPanel>
            <RightPanel>
              {showOutput && <Output />}
              <Terminal socket={socket} />
            </RightPanel>
          </Workspace>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligns children (button) to the right */
  padding: 10px; /* Adds some space around the button */
`;

const Workspace = styled.div`
  display: flex;
  margin: 0;
  font-size: 16px;
  width: 100%;
`;

const LeftPanel = styled.div`
  flex: 1;
  width: 60%;
`;

const RightPanel = styled.div`
  flex: 1;
  width: 40%;
`;

export default CodingPagePostPodCreation;

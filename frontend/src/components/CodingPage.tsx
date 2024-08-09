import useOrchestrator from "../hooks/useOrchestrator";
import CodingPagePostPodCreation from "./CodingPagePostPodCreation";

const CodingPage = () => {
  const podCreated = useOrchestrator();

  return <>{podCreated ? <CodingPagePostPodCreation /> : <>Booting...</>}</>;
};

export default CodingPage;

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import AvailableReplit from "./AvailableReplit";
import { SERVICE_URL } from "../constants";
import { getRandomSlug } from "./utils/utils";

export const Landing = () => {
  const [language, setLanguage] = useState("node-js");
  const [replId, setReplId] = useState(getRandomSlug());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onStartCodingClickHandler = async () => {
    setLoading(true);
    await axios.post(`${SERVICE_URL}/project`, { replId, language });
    setLoading(false);
    navigate(`/coding/?replId=${replId}`);
  };

  return (
    <Container>
      <Title>Repl.it</Title>
      <StyledInput
        onChange={(e) => setReplId(e.target.value)}
        type="text"
        placeholder="Repl ID"
        value={replId}
      />
      <StyledSelect
        name="language"
        id="language"
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="node-js">Node.js</option>
        <option value="python">Python</option>
      </StyledSelect>
      <StyledButton disabled={loading} onClick={onStartCodingClickHandler}>
        {loading ? "Starting ..." : "Start Coding"}
      </StyledButton>
      <AvailableReplit />
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
`;

const StyledInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledSelect = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

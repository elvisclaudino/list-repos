import React, { useState, useCallback } from "react";
import { FaGithub, FaPlus, FaSpinner } from "react-icons/fa";

import { Container } from "./styles";
import { Form } from "./styles";
import { SubmitButton } from "./styles";

import api from "../../services/api";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositories, setRepositores] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleInputChange(e) {
    setNewRepo(e.target.value);
  }

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);

        try {
          const response = await api.get(`repos/${newRepo}`);

          const data = {
            name: response.data.full_name,
          };

          setRepositores([...repositories, data]);
          setNewRepo("");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, repositories]
  );

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        My Repositories
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add Repositories"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton Loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>
    </Container>
  );
}

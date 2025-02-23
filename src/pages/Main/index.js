import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";

import { Container } from "./styles";
import { Form } from "./styles";
import { SubmitButton } from "./styles";
import { List } from "./styles";
import { DeleteButton } from "./styles";

import api from "../../services/api";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositories, setRepositores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // DisMount - Search
  useEffect(() => {
    const repoStorage = localStorage.getItem("repos");

    if (repoStorage) {
      setRepositores(JSON.parse(repoStorage));
    }
  }, []);

  // DifUpdate - Save
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repositories));
  }, [repositories]);

  function handleInputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback(
    (repo) => {
      const find = repositories.filter((r) => r.name !== repo);
      setRepositores(find);
    },
    [repositories]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        setAlert(null);

        try {
          if (newRepo === "") {
            throw new Error("You need to inform a repository");
          }

          const response = await api.get(`repos/${newRepo}`);

          const hasRepo = repositories.find((repo) => repo.name === newRepo);

          if (hasRepo) {
            throw new Error("Duplicated repository");
          }

          const data = {
            name: response.data.full_name,
          };

          setRepositores([...repositories, data]);
          setNewRepo("");
        } catch (error) {
          setAlert(true);
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

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Add Repositories"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositories.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}

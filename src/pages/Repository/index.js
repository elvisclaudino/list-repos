import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Container } from "./styles";
import { Owner } from "./styles";
import { Loading } from "./styles";
import { BackButton } from "./styles";
import { IssuesList } from "./styles";
import { PageActions } from "./styles";

import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function Repository({ match }) {
  const { repository } = useParams();

  const [repositoryData, setRepositoryData] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const [repositoryData, issuesData] = await Promise.all([
        api.get(`/repos/${repository}`),
        api.get(`/repos/${repository}/issues`, {
          params: {
            state: "open",
            per_page: 5,
          },
        }),
      ]);

      setRepositoryData(repositoryData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();
  }, [repository]);

  useEffect(() => {
    async function loadIssue() {
      const response = await api.get(`/repos/${repository}/issues`, {
        params: {
          state: "open",
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    }

    loadIssue();
  }, [repository, page]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <BackButton to={"/"}>
        <FaArrowLeft color="black" size={30} />
      </BackButton>

      <Owner>
        <img
          src={repositoryData.owner.avatar_url}
          alt={repositoryData.owner.login}
        />
        <h1>{repositoryData.name}</h1>
        <p>{repositoryData.description}</p>
      </Owner>

      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={page === 1}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Próxima
        </button>
      </PageActions>
    </Container>
  );
}

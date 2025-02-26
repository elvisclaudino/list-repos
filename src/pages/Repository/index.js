import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Container } from "./styles";
import { Owner } from "./styles";
import { Loading } from "./styles";
import { BackButton } from "./styles";
import { IssuesList } from "./styles";
import { PageActions } from "./styles";
import { FilterList } from "./styles";

import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function Repository({ match }) {
  const { repository } = useParams();

  const [repositoryData, setRepositoryData] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters] = useState([
    { state: "all", label: "All", active: true },
    { state: "open", label: "Open", active: false },
    { state: "closed", label: "Closed", active: false },
  ]);
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const [repositoryData, issuesData] = await Promise.all([
        api.get(`/repos/${repository}`),
        api.get(`/repos/${repository}/issues`, {
          params: {
            state: filters.find((f) => f.active).state,
            per_page: 5,
          },
        }),
      ]);

      setRepositoryData(repositoryData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();
  }, [repository, filters]);

  useEffect(() => {
    async function loadIssue() {
      const response = await api.get(`/repos/${repository}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    }

    loadIssue();
  }, [repository, page, filters, filterIndex]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index) {
    setFilterIndex(index);
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

      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => handleFilter(index)}
          >
            {filter.label}
          </button>
        ))}
      </FilterList>

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
          Back
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Next
        </button>
      </PageActions>
    </Container>
  );
}

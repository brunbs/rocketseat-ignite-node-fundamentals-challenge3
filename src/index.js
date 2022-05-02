const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkIfRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find(repo => repo.id === id)

  if (!repository) {
    return response.status(404).json({ error: 'Repository not found!' });
  }

  request.repository = repository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const updatedRepository = request.body;
  delete updatedRepository.likes;
  const { repository } = request;
  for(key of Object.keys(updatedRepository)) {
    repository[key] = updatedRepository[key];
  }
  return response.json(repository);
});

app.delete("/repositories/:id", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { repository } = request;

  repository.likes = ++repository.likes;
  return response.json(repository);
});

module.exports = app;

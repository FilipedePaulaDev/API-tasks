// Declaração do express (import)
const express = require('express');

// Inicializa o express
const server = express();

// Uso de JSON no corpo da requisição
server.use(express.json());

// Arrays declarados como const ainda podem adicionar
// e excluir itens.
const projects = [];

// Middleware local que checa se o id existe na lista
function checkIdExists(req, res, next) {
  // Uso do destructuring = const id = req.params.id;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}




// CRUD com adição de tasks

// Retorna todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// cria um novo projeto passando um array de tasks vazio
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

// Altera o título de um projeto passando um id
server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// Deleta um porjeto passando um id e buscando pelo index
server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// Cria uma nova task e adiciona ao pool de tasks do projeto selecionado
// pelo id
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(4000);


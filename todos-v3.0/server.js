const express = require('express');
const bodyParser = require('body-parser');

const server = express();
server.use(bodyParser.json());
// json 파일을 bodyparser가 파서하는 것을 express가 허용하지 않기 때문에 server.use(bodyParser.json())을 해야한다.

let todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'Javascript', completed: false },
];

server.get('/api/todos', (req, res) => {
  todos.sort((todo1, todo2) => todo2.id - todo1.id);
  res.send(todos);
});

server.post('/api/todos', (req, res) => {
  console.log(req.body);
  todos = [...todos, req.body];
  res.send(todos);
});

server.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo));
  res.send(todos);
});

server.delete('/api/todos/completed', (req, res) => {
  todos = todos.filter(todo => !todo.completed);
  res.send(todos);
});

server.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id !== +id);
  res.send(todos);
});

server.listen(3000, () => {
  console.log('The server is running!');
});
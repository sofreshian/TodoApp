// Global
let todos = [];

// Node
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.getElementById('ck-complete-all');
const $clearCompleted = document.querySelector('.btn');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $nav = document.querySelector('.nav');
const $all = document.getElementById('all');
const $active = document.getElementById('active');
const $completed = document.getElementById('completed');
const $fragment = document.createDocumentFragment();

const request = {
  get(url) {
    return fetch(url).then(res => res.json());
  },

  post(url, payload) {
    return fetch(url, {
      method: 'POST',
      header: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(res => res.json());
  },

  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      header: { 'content-type': 'application/json'},
      body: JSON.stringify(payload),
    }).then(res => res.json());
  },

  delete(url) {
    return fetch(url, { method: 'DELETE' }.then(res => res.json()));
  },
};

const render = () => {
  if ($todos.hasChildNodes()) [...$todos.childNodes].forEach(todo => $todos.removeChild(todo));

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  let group = [];
  if ($all.classList.contains('active')) group = todos;
  else if ($active.classList.contains('active')) group = activeTodos;
  else if ($completed.classList.contains('active')) group = completedTodos;

  group.forEach(({ id, content, completed }) => {
    const $todo = document.createElement('li');
    $todo.setAttribute('id', id);
    $todo.classList.add('todo-item');

    const $checkbox = document.createElement('input');
    $checkbox.setAttribute('id', `ck-${id}`);
    $checkbox.classList.add('checkbox');
    $checkbox.setAttribute('type', 'checkbox');
    if (completed) $checkbox.setAttribute('checked', 'checked');

    const $label = document.createElement('label');
    $label.setAttribute('for', `ck-${id}`);
    $label.textContent = content;

    const $button = document.createElement('i');
    $button.classList.add('remove-todo', 'far', 'fa-times-circle');

    $todo.append($checkbox, $label, $button);
    $fragment.appendChild($todo);
    $todos.appendChild($fragment);
  });
  $completedTodos.textContent = todos.filter(todo => todo.completed).length;
  $activeTodos.textContent = todos.filter(todo => !todo.completed).length;
};

// const fetchTodos = () => {
//   todos = [
//     { id: 3, content: 'HTML', completed: false },
//     { id: 2, content: 'CSS', completed: true },
//     { id: 1, content: 'Javascript', completed: false }
//   ];
//   todos = [...todos].sort((todo1, todo2) => todo2.id - todo1.id);
//   render();
// };

document.addEventListener('DOMContentLoaded', () => {
  request
    .get('/todos')
    .then(render)
    .catch(console.log);
});

// function
const addTodo = (() => {
  const generateId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

  return content => {
    const payload = { id: generateId(), content, completed: false };
    request
      .post('/todos', payload)
      .then('render')
      .catch(console.log);
  };
})();

const removeTodo = id => {
  request
    .delete(`/todos/${+id}`)
    .then(render)
    .catch(console.log);
};

const toggleTodo = id => {
  const todo = todos.find(todo => todo.id === +id);
  request
    .patch(`/todos/${+id}`, { ...todo, completed: !todo.completed })
    .then(render)
    .catch(console.log);
};

const toggleCompleted = target => {
  request
    .patch('/todos', { completed: target.checked })
    .then(render)
    .catch(console.log);
};

const removeCompletedAll = () => {
  request
    .delete('/todos/completed')
    .then(render)
    .catch(console.log);
};

const changeActive = e => {
  [...e.currentTarget.children].forEach(list => list.classList.remove('active'));
  e.target.classList.add('active');
  render();
};

// Event
$inputTodo.onkeyup = e => {
  if (e.key !== 'Enter' || !e.target.value) return;
  const content = $inputTodo.value;
  addTodo(content);
  $inputTodo.value = '';
};

$todos.onclick = e => {
  if (!e.target.classList.contains('remove-todo')) return;
  removeTodo(e.target.parentNode.id);
};

$todos.onchange = e => {
  const id = +e.target.parentNode.id;
  toggleTodo(id);
};

$completeAll.onchange = e => {
  toggleCompleted(e.target);
};

$clearCompleted.onclick = () => {
  removeCompletedAll();
};

$nav.onclick = e => {
  changeActive(e);
};

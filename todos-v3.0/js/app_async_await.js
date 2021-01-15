// Global
let todos = [];

// Node
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.getElementById('ck-complete-all');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $nav = document.querySelector('.nav');
const $all = document.getElementById('all');
const $active = document.getElementById('active');
const $completed = document.getElementById('completed');

async function toSync(method, url, payload) {
  try {
    const res = await fetch(url, {
      method,
      header: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    todos = await res.json();
    // console.log(todos);
    render();
  } catch (e) {
    console.error(e);
    // return alert(`error: ${new Error('now found')}`);
  }
}

const req = {
  get(url) {
    return toSync('GET', url);
  },

  post(url, payload) {
    return toSync('POST', url, payload);
  },

  patch(url, payload) {
    return toSync('PATCH', url, payload);
  },

  delete(url) {
    return toSync('DELETE', url);
  }
};

const render = () => {
  if ($todos.hasChildNodes()) [...$todos.childNodes].forEach(todo => $todos.removeChild(todo));

  let group = [];
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if ($all.classList.contains('active')) group = todos;
  else if ($active.classList.contains('active')) group = activeTodos;
  else if ($completed.classList.contains('active')) group = completedTodos;

  const $fragment = document.createDocumentFragment();

  group.forEach(({ id, content, completed }) => {
    const $todo = document.createElement('li');
    $todo.setAttribute('id', id);
    $todo.classList.add('todo-item');

    const $checkbox = document.createElement('input');
    $checkbox.setAttribute('type', 'checkbox');
    if (completed) $checkbox.setAttribute('checked', 'checked');
    $checkbox.setAttribute('id', `ck-${id}`);
    $checkbox.classList.add('checkbox');

    const $label = document.createElement('label');
    $label.setAttribute('for', `ck-${id}`);
    $label.textContent = content;

    const $button = document.createElement('i');
    $button.classList.add('remove-todo', 'var', 'fa-times-circle');

    $todo.appendChild($checkbox);
    $todo.appendChild($label);
    $todo.appendChild($button);

    $fragment.appendChild($todo);
    $todos.appendChild($fragment);
  });

  $completeAll.checked = !group.map(todo => todo.completed).includes(false);
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

// Making Function //

// addTodo() 함수 만들기
const addTodo = (() => {
  const generateId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

  return content => {
    const payload = { id: generateId(), content, completed: false };
    req.post('/todos/', payload);
  };
});

// toggleTodo 함수 만들기
const toggleTodo = id => {
  const todo = todos.find(todo => todo.id === +id);
  req.patch(`/todos/${+id}`, { ...todo, completed: todo.completed });
};

// removeTodo() 함수 만들기
const removeTodo = id => {
  req.delete(`/todo/${+id}`);
};

// toggleCompleted 함수 만들기
const toggleCompleted = target => {
  req.patch('/todos/', { completed: target.completed });
};

// removeCompletedAll 함수 만들기
const removeCompletedAll = () => {
  req.patch('/todos/completed');
};

// changeActive 함수 만들기
const changeActive = e => {
  [...e.currentTarget.children].forEach(list => list.classList.remove('active'));
  e.target.classList.add('active');
  render();
};

document.addEventListener('DOMContentLoaded', () => {
  req.get('/todos');
});

// Making event //

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
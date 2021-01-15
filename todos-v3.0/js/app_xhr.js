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

// Ajax
const request = (() => {
  function req(method, url, cb, payload) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        cb(JSON.parse(xhr.response));
      } else {
        throw new Error('Error' + xhr.status);
      }
    };
  }

  return {
    get(url, cb) {
      req('GET', url, cb);
    },

    post(url, cb, payload) {
      req('POST', url, cb, payload);
    },

    patch(url, cb, payload) {
      req('PATCH', url, cb, payload);
    },

    delete(url, cb) {
      req('DELETE', url, cb);
    },
  };
})();

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
    $button.classList.add('remove-todo', 'far', 'fa-times-circle');

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
    request.post('/todos', render, payload);
  };
})();

// toggleTodo 함수 만들기
const toggleTodo = id => {
  const todo = todos.find(todo => todo.id === +id);
  request.patch(`/todos/${+id}`, render, { ...todo, completed: !todo.completed });
};

// removeTodo() 함수 만들기
const removeTodo = id => {
  request.delete(`/todos/${+id}`, render);
};

// toggleCompleted 함수 만들기
const toggleCompleted = target => {
  request.patch('/todos', render, { completed: target.checked });
};

// removeCompletedAll 함수 만들기
const removeCompletedAll = () => {
  request.delete('/todos/completed', render);
};

// changeActive 함수 만들기
const changeActive = e => {
  [...e.currentTarget.children].forEach(list => list.classList.remove('active'));
  e.target.classList.add('active');
  render();
};

document.addEventListener('DOMContentLoaded', () => {
  request.get('/todos');
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

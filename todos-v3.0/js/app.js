let todos = [];
let activeTodos = [];
let completedTodos = [];

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

const divideTodos = () => {
  activeTodos = todos.filter(todo => !todo.completed);
  completedTodos = todos.filter(todo => todo.completed);
};

const render = () => {
  // if ($todos.hasChildNodes()) [...$todos.childNodes].forEach(todo => $todos.removeChild(todo));

  let group = [];

  divideTodos(); // Closure

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

const fetchTodos = () => {
  // 서버로부터 todos 데이터를 취득한다 (잠정처리)
  todos = [
    { id: 3, content: 'HTML', completed: false },
    { id: 2, content: 'CSS', completed: true },
    { id: 1, content: 'Javascript', completed: false }
  ];
  todos = [...todos].sort((todo1, todo2) => todo2.id - todo1.id);
  /*
  sort는 this를 변경하면서 원본을 변경한 배열을 반환해서
  todos = toto.sort((todo1, todo2) => todo2.id - todo1.id); 를 써도 되지만,
  바람직하지않기 때문에
  todos = [...todos].sort((todo1, todo2) => todo2.id - todo1.id);
  */
  render();
};

// Making Function //

// addTodo() 함수 만들기
const generateId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);
const addTodo = content => {
  todos = [{ id: generateId(), content, completed: false }, ...todos];
  render();
};

// toggleTodo 함수 만들기
const toggleTodo = id => {
  todos = todos.map(todo => (todo.id === +id ? { ...todo, completed: !todo.completed } : todo));
  render();
};

// removeTodo() 함수 만들기
const removeTodo = id => {
  todos = todos.filter(todo => todo.id !== +id);
  render();
};

// toggleCompleted 함수 만들기
const toggleCompleted = () => {
  todos = todos.map(todo => ({ ...todo, completed: $completeAll.checked }));
  render();
};

// removeCompletedAll 함수 만들기
const removeCompletedAll = () => {
  todos = todos.filter(todo => !todo.completed);
  render();
};

// changeActive 함수 만들기
const changeActive = e => {
  [...e.currentTarget.children].forEach(list => list.classList.remove('active'));
  e.target.classList.add('active');
  render();
};

document.addEventListener('DOMContentLoaded', fetchTodos);

// Making event //

$inputTodo.onkeyup = e => {
  if (e.key !== 'Enter' || !e.target.value) return;
  const content = $inputTodo.value;
  addTodo(content);
  $inputTodo.value = '';
};

$todos.onclick = e => {
  // contains 안에 클래스는 점이 붙지 않는다.
  if (!e.target.classList.contains('remove-todo')) return;
  removeTodo(e.target.parentNode.id);
};
/*
 < another way to solve >

$todos.onclick = e => {
  if (!e.target.matches('.todos .remove-todo')) return;
  removeTodo(e.target);
};
*/

$todos.onchange = e => {
  const id = +e.target.parentNode.id;
  toggleTodo(id);
};

$completeAll.onchange = e => {
  // console.log(e.target.checked);
  toggleCompleted(e.target);
};

// todo의 완료된 항목을 다 지운다
$clearCompleted.onclick = () => {
  removeCompletedAll();
};

$nav.onclick = e => {
  changeActive(e);
};

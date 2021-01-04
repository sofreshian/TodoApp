// Global State
let todos = [];

// DOM nodes
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.getElementById('ck-complete-all');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
const $completed = document.querySelector('.completed-todos');
const $active = document.querySelector('.active-todos');

const render = () => {
  // console.log('[todos]', todos);
  $todos.innerHTML = todos.map(({ id, content, completed }) => `<li id="${id}" class="todo-item">
    <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
    <label for="ck-${id}">${content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>`).join();

  $completed.textContent = todos.filter(todo => todo.completed).length;
  $active.textContent = todos.filter(todo => !todo.completed).length;
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

/*
generateId() 함수 만들기(현재 할일 데이터중 가장큰 아이디 값보다 +1 큰 아이디를 얻을 수 있다.)
데이터를 하나도 없이 새로 넣으면 -Infinity 가 나오는 것을 확인할 수 있다 (Math.max에 인수를 안주면 -Infinity 값을 반환한다)
(이말은 todos가 비어있었다면 id값을 파악하기 어렵다. )
 */
const generateId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);
// 빈배열일 경우 1을 나오게 할 수도 있다
// const generateId = () => Math.max(...todos.map(todo => todo.id), 1);


// addTodo() 함수 만들기
const addTodo = content => {
  todos = [{ id: generateId(), content, completed: false }, ...todos];
  render();
};

// toggleTodo() 함수 만들기
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

document.addEventListener('DOMContentedLoaded', fetchTodos());

// 키보드 이벤트 발생
$inputTodo.onkeyup = e => {
  const content = $inputTodo.value;
  if (e.key !== 'Enter' || !content) return;
  // e.key 프로퍼티에는 문자열이 담겨 있는데 'Enter'키가 아니면 반환! / 빈문자열 경우 반환

  addTodo(content);

  // 이렇게 하면 안됨, 원시값이기 때문에 pass by value이기 때문
  // content = '';

  // 새롭게 재할당해야 한다.
  $inputTodo.value = '';
};

$todos.onchange = e => {
  const id = +e.target.parentNode.id;
  toggleTodo(id);
};

$todos.onclick = e => {
  // contains 안에 클래스는 점이 붙지 않는다.
  if (!e.target.classList.contains('remove-todo')) return;
  removeTodo(e.target.parentNode.id);
};

$completeAll.onchange = toggleCompleted();

$clearCompleted.onclick = removeCompletedAll();

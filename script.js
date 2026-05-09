// ===========================
// DOM 요소 선택
// ===========================
const todoInput = document.querySelector('#todoInput');
const addButton = document.querySelector('#addButton');
const todoList  = document.querySelector('#todoList');
const todoCount = document.querySelector('#todoCount');

// 연결 확인 (개발 중 확인용 — 나중에 삭제)
console.log('todoInput:', todoInput);
console.log('addButton:', addButton);
console.log('todoList:', todoList);
console.log('todoCount:', todoCount);

// ===========================
// 상태 (State)
// ===========================
let todos = (function () {
  try {
    return JSON.parse(localStorage.getItem('todos')) || [];
  } catch (e) {
    return [];
  }
})();
let currentFilter = 'all';

// ===========================
// 함수
// ===========================

function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter(function (t) { return !t.completed; });
  if (currentFilter === 'done')   return todos.filter(function (t) { return  t.completed; });
  return todos;
}

function updateCount() {
  const remaining = todos.filter(function (todo) {
    return !todo.completed;
  }).length;
  todoCount.textContent = '남은 할 일: ' + remaining + '개';
}

function renderTodos() {
  todoList.innerHTML = '';

  getFilteredTodos().forEach(function (todo) {
    const item = document.createElement('div');
    item.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;

    const span = document.createElement('span');
    span.textContent = todo.text;

    const editBtn = document.createElement('button');
    editBtn.textContent = '수정';
    editBtn.className = 'edit-btn';
    editBtn.dataset.id = todo.id;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    deleteBtn.dataset.id = todo.id;

    item.appendChild(checkbox);
    item.appendChild(span);
    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
    todoList.appendChild(item);
  });

  updateCount();
}

function toggleTodo(id) {
  todos = todos.map(function (todo) {
    if (todo.id === id) {
      return { id: todo.id, text: todo.text, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const todo = todos.find(function (t) { return t.id === id; });
  if (!todo) return;
  const newText = prompt('할 일을 수정하세요:', todo.text);
  if (newText !== null && newText.trim() !== '') {
    todo.text = newText.trim();
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
  saveTodos();
  renderTodos();
}

// ===========================
// 이벤트 연결
// ===========================

addButton.addEventListener('click', function () {
  const text = todoInput.value.trim();
  if (text === '') {
    alert('할 일을 입력해 주세요.');
    return;
  }
  addTodo(text);
  todoInput.value = '';
});

todoInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.isComposing) {
    addButton.click();
  }
});

// 필터 버튼
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// 체크박스: 완료 토글
todoList.addEventListener('change', function (e) {
  if (e.target.type === 'checkbox') {
    const id = Number(e.target.dataset.id);
    toggleTodo(id);
  }
});

// 수정/삭제 버튼
todoList.addEventListener('click', function (e) {
  if (e.target.classList.contains('edit-btn')) {
    const id = Number(e.target.dataset.id);
    editTodo(id);
  }
  if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.dataset.id);
    deleteTodo(id);
  }
});

// ===========================
// 초기 렌더링
// ===========================
renderTodos();

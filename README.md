# JavaScript Todo App
### 과제 2 — Vanilla JavaScript로 만드는 Todo 앱

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기획 및 요구사항 분석](#2-기획-및-요구사항-분석)
3. [설계](#3-설계)
4. [단계별 개발 과정](#4-단계별-개발-과정)
5. [최종 구현 결과](#5-최종-구현-결과)
6. [AI 활용 기록](#6-ai-활용-기록)
7. [회고](#7-회고)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | 오늘의 Todo |
| 목적 | Vanilla JavaScript 기본기 학습 및 동적 앱 구현 |
| 기술 스택 | HTML5, CSS3, Vanilla JavaScript, localStorage |
| 실행 방법 | `index.html` 파일을 브라우저에서 열기 |

---

## 2. 기획 및 요구사항 분석

### 과제 핵심 흐름

```
입력 (Input) → 배열 (Array) → 렌더링 (Render) → 이벤트 (Event) → 반복
```

데이터가 바뀌면 화면도 반드시 다시 갱신해야 한다는 것이 핵심입니다.

### 필수 기능 분석

| 번호 | 기능 | 구현 여부 |
|---|---|---|
| 1 | Todo 입력창 | ✅ |
| 2 | 추가 버튼 클릭 시 목록에 추가 | ✅ |
| 3 | 빈 값 입력 방지 | ✅ |
| 4 | 추가된 Todo 목록 표시 | ✅ |
| 5 | 완료/미완료 상태 변경 | ✅ |
| 6 | Todo 개별 삭제 | ✅ |
| 7 | 상태 변경 시 화면 즉시 갱신 | ✅ |
| 8 | 입력창/버튼/목록/상태 구분된 UI | ✅ |

### 선택 기능 분석

| 기능 | 난이도 | 구현 여부 |
|---|---|---|
| 남은 할 일 개수 표시 | 쉬움 | ✅ |
| 전체/진행중/완료 필터 | 중간 | ✅ |
| localStorage 저장 | 중간 | ✅ |
| Todo 수정 기능 | 중간 | ✅ |

---

## 3. 설계

### 파일 구조

```
todoist-app/
├── index.html   ← 화면 구조 (뼈대)
├── style.css    ← UI 스타일 (디자인)
├── script.js    ← JavaScript 로직 (동작)
└── README.md    ← 문서 (기획서 + 회고)
```

### 화면 구조 설계

```
┌─────────────────────────┐
│         Header          │  ← 제목
├─────────────────────────┤
│   [ 입력창 ] [ 추가 ]    │  ← Input Area
├─────────────────────────┤
│  전체  |  진행중  |  완료  │  ← Filter
├─────────────────────────┤
│  ☐ 할 일 1  [수정][삭제] │  ← Todo Item
│  ☑ 할 일 2  [수정][삭제] │
├─────────────────────────┤
│      남은 할 일: N개      │  ← Status Area
└─────────────────────────┘
```

### 데이터 구조

```js
// Todo 객체 하나의 형태
{
  id: Date.now(),         // 고유 식별자 (숫자)
  text: "할 일 내용",      // 사용자 입력 텍스트
  completed: false        // 완료 여부 (Boolean)
}

// 전체 상태
let todos = [];           // Todo 배열
let currentFilter = 'all'; // 현재 필터 상태
```

### 함수 구조 설계

```
addTodo(text)        ← 새 Todo 생성 및 배열 추가
renderTodos()        ← 배열을 화면에 출력 (핵심 함수)
toggleTodo(id)       ← 완료/미완료 전환
editTodo(id)         ← 텍스트 수정
deleteTodo(id)       ← 배열에서 제거
updateCount()        ← 남은 개수 갱신
saveTodos()          ← localStorage에 저장
getFilteredTodos()   ← 필터에 맞는 목록 반환
```

---

## 4. 단계별 개발 과정

### Phase 1 — 기초 (뼈대 만들기)

#### 1단계: HTML 구조 작성

`index.html`에 4개 영역을 나눠 작성했습니다.

```html
<header>
  <h1>오늘의 Todo</h1>
</header>

<div class="input-area">
  <input id="todoInput" type="text" placeholder="할 일을 입력하세요" />
  <button id="addButton">추가</button>
</div>

<div id="todoList"></div>

<p id="todoCount">남은 할 일: 0개</p>

<script src="script.js"></script>
```

**포인트:** `<script>` 태그는 반드시 `</body>` 직전에 위치해야 DOM이 먼저 그려진 뒤 JS가 실행됩니다.

---

#### 2단계: DOM 요소 선택

HTML의 `id`와 JavaScript의 `querySelector`가 일치하는지 확인합니다.

```js
const todoInput = document.querySelector('#todoInput');
const addButton = document.querySelector('#addButton');
const todoList  = document.querySelector('#todoList');
const todoCount = document.querySelector('#todoCount');

// 연결 확인
console.log('todoInput:', todoInput);
```

**포인트:** `#`을 빠뜨리거나 id 이름이 다르면 `null`이 반환됩니다.

---

#### 3단계: todos 배열 + addTodo() 함수

배열에 데이터를 추가하는 함수를 작성합니다.

```js
let todos = [];

function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  todos.push(newTodo);
}
```

---

### Phase 2 — 핵심 기능 구현

#### 4단계: 이벤트 연결

```js
addButton.addEventListener('click', function () {
  const text = todoInput.value.trim();
  if (text === '') {
    alert('할 일을 입력해 주세요.');
    return;
  }
  addTodo(text);
  todoInput.value = '';
});

// Enter 키 지원 (한국어 IME 처리)
todoInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.isComposing) {
    addButton.click();
  }
});
```

**포인트:** `!e.isComposing`이 없으면 한국어 입력 확정 시 Todo가 두 번 추가됩니다.

---

#### 5단계: renderTodos() — 화면 렌더링

**과제에서 가장 중요한 함수입니다.**  
데이터가 바뀔 때마다 이 함수를 호출해 화면 전체를 다시 그립니다.

```js
function renderTodos() {
  todoList.innerHTML = '';  // 기존 목록 초기화

  getFilteredTodos().forEach(function (todo) {
    const item = document.createElement('div');
    item.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;

    const span = document.createElement('span');
    span.textContent = todo.text;

    // ... 버튼 생성 후 item에 추가
    todoList.appendChild(item);
  });

  updateCount();
}
```

---

#### 6단계: toggleTodo() + deleteTodo()

```js
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

function deleteTodo(id) {
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });
  saveTodos();
  renderTodos();
}
```

**이벤트 위임 방식으로 연결:**

```js
// 인라인 onclick 사용 안 함 — todoList 하나에만 이벤트 연결
todoList.addEventListener('change', function (e) {
  if (e.target.type === 'checkbox') {
    toggleTodo(Number(e.target.dataset.id));
  }
});

todoList.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    deleteTodo(Number(e.target.dataset.id));
  }
});
```

**포인트:** `dataset.id`는 항상 **문자열**이므로 `Number()`로 변환해야 합니다.

---

### Phase 3 — 선택 기능 (심화)

#### 7단계: updateCount()

```js
function updateCount() {
  const remaining = todos.filter(function (t) { return !t.completed; }).length;
  todoCount.textContent = '남은 할 일: ' + remaining + '개';
}
```

---

#### 8단계: 필터링

```js
let currentFilter = 'all';

function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter(function (t) { return !t.completed; });
  if (currentFilter === 'done')   return todos.filter(function (t) { return  t.completed; });
  return todos;
}
```

필터 버튼 HTML:

```html
<div class="filter-area">
  <button class="filter-btn active" data-filter="all">전체</button>
  <button class="filter-btn" data-filter="active">진행중</button>
  <button class="filter-btn" data-filter="done">완료</button>
</div>
```

---

#### 9단계: localStorage 저장

```js
// 안전한 초기화 (try/catch로 손상된 데이터 대비)
let todos = (function () {
  try {
    return JSON.parse(localStorage.getItem('todos')) || [];
  } catch (e) {
    return [];
  }
})();

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}
```

**포인트:** `JSON.parse()`는 데이터가 손상되면 오류를 던지므로 `try/catch`가 필수입니다.

---

#### 10단계: editTodo()

```js
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
```

---

### Phase 4 — 마무리

#### 11단계: style.css

- 카드형 레이아웃, 최대 너비 480px 중앙 정렬
- 완료 항목: 취소선(`text-decoration: line-through`) + 회색 처리
- 필터 활성 버튼: 파란색 배경
- 수정/삭제 버튼: 색상으로 역할 구분 (파랑/빨강)

#### 12단계: README.md

과제 제출 요구사항에 맞춰 기획서 + AI 활용 기록 + 회고 작성.

---

## 5. 최종 구현 결과

### 기능 체크리스트

- [x] Todo 추가 (버튼 클릭 / Enter 키)
- [x] 빈 값 입력 방지
- [x] 완료/미완료 토글 (체크박스)
- [x] Todo 수정
- [x] Todo 삭제
- [x] 남은 개수 실시간 표시
- [x] 상태별 필터 (전체 / 진행중 / 완료)
- [x] localStorage 영구 저장
- [x] 한국어 IME Enter 처리
- [x] XSS 방지 (`textContent` 사용)

### 평가 기준 대비 자가 점검

| 평가 영역 | 배점 | 자가 평가 |
|---|---|---|
| 필수 기능 구현 | 30점 | 30점 |
| JavaScript 구조 | 20점 | 18점 |
| 렌더링 흐름 이해 | 15점 | 15점 |
| UI 및 사용성 | 10점 | 9점 |
| 예외 처리 | 10점 | 9점 |
| AI 활용 과정 | 10점 | 9점 |
| README/회고 | 5점 | 5점 |

---

## 6. AI 활용 기록

### 사용한 프롬프트 (단계별 요청)

1. **분석 요청**
   > "https://github.com/guhakim/todoist-app 여기 분석해줘"

2. **과제 요구사항 분석 요청**
   > 과제 PDF와 슬라이드를 제공하며 기존 코드와 비교 분석 요청

3. **설계 요청**
   > "기초부터 다져가면서 만들어줘. 1단계, 2단계, 3단계 분석에서 나온 기초부터 진행해줘."

4. **단계별 구현** — 전체를 한 번에 요청하지 않고 단계마다 진행

### AI가 제안한 내용 중 그대로 사용한 부분

- `!e.isComposing` 한국어 IME 처리
- 이벤트 위임(event delegation) 패턴
- `todos.map()`으로 completed 토글하는 불변 패턴
- localStorage 초기화 즉시실행함수(IIFE) + try/catch 구조

### AI 제안을 이해하고 확인한 부분

- `dataset.id`가 문자열이라 `Number()` 변환 필요
- `renderTodos()` 내부에서 `updateCount()` 호출하는 흐름
- 이벤트 위임에서 `.classList.contains()`로 버튼 구분

### 직접 결정한 부분

- 인라인 `onclick` 대신 `addEventListener` + `dataset.id` 방식 채택
- 과제 권장 함수명 그대로 사용 (`addTodo`, `renderTodos`, `toggleTodo`, `deleteTodo`, `updateCount`)
- 수정/삭제 버튼에 `.edit-btn` / `.delete-btn` 클래스 부여

---

## 7. 회고

### 어려웠던 점

- `renderTodos()` 호출 시점을 빠뜨려 화면이 갱신되지 않는 문제
- 인라인 `onclick` 대신 이벤트 위임을 써야 하는 이유 이해
- `dataset.id`가 문자열이라 `id === Number(dataset.id)` 비교가 실패하는 원인 파악

### 해결 방법

- 상태 변경 함수 끝에는 항상 `saveTodos()` → `renderTodos()` 를 호출한다는 규칙 수립
- 이벤트 위임: 동적으로 생성된 요소에도 이벤트가 적용된다는 개념 이해
- `Number(e.target.dataset.id)` 변환으로 타입 불일치 해결

### 핵심적으로 배운 것

> 배열(데이터)이 바뀌면 `renderTodos()`로 화면을 다시 그린다.  
> 화면은 데이터의 결과물이다.

### 다음에 개선하고 싶은 점

- `prompt()` 대신 인라인 편집 필드로 수정 UX 개선
- 드래그 앤 드롭으로 순서 변경
- 다크모드 토글 추가

# JavaScript Todo App

## 1. 프로젝트 소개

Vanilla JavaScript로 만든 Todo 앱입니다.  
할 일을 추가, 완료, 수정, 삭제할 수 있으며 새로고침 후에도 데이터가 유지됩니다.

## 2. 주요 기능

- Todo 추가 (버튼 클릭 또는 Enter 키)
- 빈 값 입력 방지
- 완료/미완료 상태 토글 (체크박스)
- Todo 수정 (수정 버튼)
- Todo 삭제 (삭제 버튼)
- 남은 할 일 개수 실시간 표시
- 상태별 필터링 (전체 / 진행중 / 완료)
- localStorage로 데이터 영구 저장

## 3. 사용 기술

- HTML5
- CSS3 (커스텀)
- Vanilla JavaScript (ES6)
- localStorage

## 4. 실행 방법

별도 설치 없이 `index.html` 파일을 브라우저에서 열면 바로 실행됩니다.

## 5. 파일 구조

```
todo-app/
├── index.html   # 화면 구조
├── style.css    # 스타일
├── script.js    # JavaScript 로직
└── README.md    # 프로젝트 문서
```

## 6. 핵심 데이터 흐름

```
입력 (Input) → 배열 (Array) → 렌더링 (Render) → 이벤트 (Event) → 반복
```

모든 상태 변경(추가/수정/삭제/완료)은 반드시 `renderTodos()`를 호출해 화면을 갱신합니다.

## 7. 주요 함수 설명

| 함수 | 역할 |
|---|---|
| `addTodo(text)` | 텍스트로 새 Todo 객체 생성 후 배열에 추가 |
| `renderTodos()` | 현재 배열(필터 적용)을 화면에 다시 표시 |
| `toggleTodo(id)` | 완료/미완료 상태 전환 |
| `editTodo(id)` | prompt로 텍스트 수정 |
| `deleteTodo(id)` | 해당 id의 Todo를 배열에서 제거 |
| `updateCount()` | 남은 미완료 개수를 화면에 반영 |
| `saveTodos()` | 현재 배열을 localStorage에 저장 |
| `getFilteredTodos()` | 현재 필터에 맞는 Todo 목록 반환 |

## 8. AI 활용 기록

### 사용한 프롬프트 (단계별 요청)

1. **설계 요청**
   > "Vanilla JavaScript Todo 앱을 기초부터 단계별로 만들어줘. 과제 요구사항을 분석한 다음 1단계(HTML) → 2단계(DOM 선택) → 3단계(배열+함수) 순으로 진행해줘."

2. **이벤트 처리 요청**
   > "버튼 클릭과 Enter 키 이벤트를 연결해줘. 한국어 IME 입력 중 Enter가 눌릴 때 중복 실행되지 않도록 처리도 포함해줘."

3. **렌더링 구조 요청**
   > "renderTodos() 함수를 만들어줘. 배열을 순회하며 각 Todo를 createElement로 만들고, 체크박스/수정/삭제 버튼을 포함해줘. 인라인 onclick은 사용하지 말고 addEventListener + dataset.id 방식으로 해줘."

4. **localStorage 요청**
   > "localStorage 저장 기능을 추가해줘. JSON.parse 실패에 대비한 try/catch도 넣어줘."

### AI가 제안한 내용 중 그대로 사용한 부분

- `!e.isComposing` 한국어 IME 처리 방식
- 이벤트 위임(event delegation) 패턴 (`todoList.addEventListener`)
- `todos.map()`으로 completed 토글하는 불변 패턴
- localStorage 초기화 즉시실행함수(IIFE) + try/catch 구조

### AI가 제안했지만 구조를 이해하고 확인한 부분

- `dataset.id`가 문자열로 반환되므로 `Number()` 변환이 필요하다는 점
- `renderTodos()` 내부에서 `updateCount()`를 호출하는 흐름
- 이벤트 위임에서 `.classList.contains()`로 수정/삭제 버튼을 구분하는 방법

### 배운 점

- 배열에 데이터를 추가해도 `renderTodos()`를 호출하지 않으면 화면이 갱신되지 않는다.
- `dataset.id`는 항상 문자열이라 `===` 비교 전에 `Number()` 변환이 필요하다.
- 이벤트 위임을 사용하면 동적으로 추가된 요소에도 이벤트가 자동으로 적용된다.
- `!e.isComposing`이 없으면 한국어 입력 확정 시 Todo가 두 번 추가될 수 있다.

## 9. 회고

### 어려웠던 점

- `renderTodos()` 호출 시점을 놓쳐 화면이 갱신되지 않는 문제가 초반에 있었다.
- 삭제/수정 버튼에 인라인 `onclick`을 쓰면 안 된다는 이유를 처음엔 이해하기 어려웠다.

### 해결 방법

- 상태가 변경되는 모든 함수 끝에 `saveTodos()` → `renderTodos()` 를 반드시 호출하는 규칙을 정했다.
- 이벤트 위임 방식을 사용하면 동적으로 생성된 버튼에도 이벤트가 적용된다는 개념을 이해했다.

### 다음에 개선하고 싶은 점

- `prompt()` 대신 인라인 편집 필드로 수정 UX 개선
- 드래그 앤 드롭으로 순서 변경 기능 추가
- 다크모드 토글 추가

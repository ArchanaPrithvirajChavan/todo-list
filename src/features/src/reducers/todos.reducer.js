const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: "",
};

const actions = {
  // --- Fetching ---
  fetchTodos: "fetchTodos",
  loadTodos: "loadTodos",
  setLoadError: "setLoadError",

  // --- Adding / Request ---
  startRequest: "startRequest",
  addTodo: "addTodo",
  endRequest: "endRequest",

  // --- Updating / Completing ---
  updateTodo: "updateTodo",
  completeTodo: "completeTodo",
  revertTodo: "revertTodo",

  // --- UI ---
  clearError: "clearError",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    // --- FETCH TODOS ---
    case actions.fetchTodos:
      return { ...state, isLoading: true };

    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => ({
          id: record.id,
          title: record.fields.title,
          isCompleted: record.fields.isCompleted ?? false,
        })),
        isLoading: false,
      };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error ? action.error.message : "",
        isLoading: false,
      };

    // --- REQUEST / ADD TODO ---
    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addTodo: {
      if (!action.todo) return state; // safety check
      return {
        ...state,
        todoList: [...state.todoList, action.todo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return { ...state, isSaving: false, isLoading: false };

    // --- UPDATE / REVERT TODO ---
    case actions.updateTodo:
    case actions.revertTodo: {
      if (!action.todo) return state; // safety check

      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.todo.id ? action.todo : todo
      );

      return {
        ...state,
        todoList: updatedTodos,
        errorMessage: action.error ? action.error.message : "",
      };
    }

    // --- COMPLETE TODO ---
    case actions.completeTodo: {
      if (!action.id) return state; // safety check

      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );

      return {
        ...state,
        todoList: updatedTodos,
        errorMessage: action.error ? action.error.message : "",
      };
    }

    // --- CLEAR ERROR ---
    case actions.clearError:
      return { ...state, errorMessage: "" };

    default:
      return state;
  }
}

export { actions, initialState, reducer };

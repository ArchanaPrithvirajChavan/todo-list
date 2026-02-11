import "./App.css";          // global styles
import styles from "./App.module.css"; // component styles

import React, { useReducer, useState, useEffect, useCallback } from "react";
import TodoList from "./features/TodoList";
import TodoForm from "./features/TodoForm";
import TodosViewForm from "./features/TodosViewForm";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./features/src/reducers/todos.reducer";

function App() {
  // --- useReducer for all todos state ---
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  // --- Sorting and search state ---
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // --- Debounce query ---
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(queryString), 500);
    return () => clearTimeout(timeoutId);
  }, [queryString]);

  // --- Airtable config ---
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (debouncedQuery) {
      searchQuery = `&filterByFormula=SEARCH("${debouncedQuery}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, sortField, sortDirection, debouncedQuery]);

  // --- Fetch Todos ---
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      try {
        const resp = await fetch(encodeUrl(), { method: "GET", headers: { Authorization: token } });
        if (!resp.ok) throw new Error(resp.statusText || resp.status);

        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [encodeUrl, token]);

  // --- Add Todo ---
  const addTodo = async (newTodo) => {
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [{ fields: { title: newTodo.title, isCompleted: newTodo.isCompleted || false } }],
    };

    try {
      const resp = await fetch(encodeUrl(), {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(resp.statusText || resp.status);

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.title || "",
        isCompleted: records[0].fields.isCompleted || false,
      };

      dispatch({ type: todoActions.addTodo, todo: savedTodo });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // --- Update Todo ---
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);

    // Optimistic update
    dispatch({ type: todoActions.updateTodo, todo: editedTodo });

    try {
      const resp = await fetch(encodeUrl(), {
        method: "PATCH",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({
          records: [{ id: editedTodo.id, fields: { title: editedTodo.title, isCompleted: editedTodo.isCompleted } }],
        }),
      });
      if (!resp.ok) throw new Error(resp.statusText || resp.status);
    } catch (error) {
      // Revert on failure
      dispatch({ type: todoActions.revertTodo, todo: originalTodo, error });
    }
  };

  // --- Complete Todo ---
  const completeTodo = async (id) => {
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);

    // Optimistic update
    dispatch({ type: todoActions.completeTodo, id });

    try {
      const resp = await fetch(encodeUrl(), {
        method: "PATCH",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ records: [{ id, fields: { title: originalTodo.title, isCompleted: true } }] }),
      });
      if (!resp.ok) throw new Error(resp.statusText || resp.status);
    } catch (error) {
      // Revert on failure
      dispatch({ type: todoActions.revertTodo, todo: originalTodo, error });
    }
  };

  // --- Render ---
  return (
    <div className={styles.app}>
      <h1>MY Todo List</h1>

      <div className={styles.logo}>
        <img src="/deep.jpg" alt="App logo" className={styles.logo} />
      </div>

      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {todoState.errorMessage && (
        <div className={styles.error}>
          <p>{todoState.errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;

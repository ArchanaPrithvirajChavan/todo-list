
import React, { useState, useEffect,useCallback } from "react";
import TodoList from "./features/TodoList";

import TodoForm from "./features/TodoForm";
import TodosViewForm from "./features/TodosViewForm";
import "./App.css";

   function App() {
  /* State */
  const [todoList, setTodoList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
  const timeoutId = setTimeout(() => {
    setDebouncedQuery(queryString);
  }, 500);

  return () => {
    clearTimeout(timeoutId);
  };
}, [queryString]);

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

  /* Airtable Config */
  
  /* 
     Fetch Todos */
  useEffect(() => {
  const fetchTodos = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const options = {
      method: "GET",
      headers: { Authorization: token },
    };

    try {
      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) throw new Error(resp.statusText || resp.status);

      const { records } = await resp.json();

      const fetchedTodos = records.map((record) => ({
        id: record.id,
        title: record.fields.title || "",
        isCompleted: record.fields.isCompleted || false,
      }));

      setTodoList(fetchedTodos);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchTodos();
}, [encodeUrl, token]);


  /* Add Todo */
  const addTodo = async (newTodo) => {
    setIsSaving(true);
    setErrorMessage("");

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted || false,
          },
        },
      ],
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(
        encodeUrl(),
        options
      );

      if (!resp.ok) throw new Error(resp.statusText || resp.status);

      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        title: records[0].fields.title || "",
        isCompleted: records[0].fields.isCompleted || false,
      };

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  /* Update Todo */
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    setTodoList(
      todoList.map((todo) =>
        todo.id === editedTodo.id ? editedTodo : todo
      )
    );

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(
        encodeUrl(),
        options
      );

      if (!resp.ok) throw new Error(resp.statusText || resp.status);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting changes.`);
      setTodoList(
        todoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );
    }
  };

  /* 
     Complete Todo*/
   
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);

    const updatedTodo = { ...originalTodo, isCompleted: true };
    setTodoList(todoList.map((todo) => (todo.id === id ? updatedTodo : todo)));

    const payload = {
      records: [
        {
          id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(
        encodeUrl(),
        options
      );

      if (!resp.ok) throw new Error(resp.statusText || resp.status);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting changes.`);
      setTodoList(
        todoList.map((todo) =>
          todo.id === id ? originalTodo : todo
        )
      );
    }
  };

  /* 
     Render
  */
  return (
    <>
      <h1>MY Todo List</h1>
<TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      
  <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

<TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      

      {errorMessage && (
        <div>
          <hr />
          <p style={{ color: "red" }}>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </>
  );
}

export default App;

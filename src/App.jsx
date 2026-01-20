import './App.css';
import React, { useState, useEffect } from "react";
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoList/TodoForm';

function App() {
  
  const [todoList, setTodoList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const options = { method: "GET", headers: { Authorization: token } };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(resp.statusText || `Error: ${resp.status}`);

        const { records } = await resp.json();

        const fetchedTodos = records.map(record => {
          const todo = { id: record.id, ...record.fields };
          if (!todo.isCompleted) todo.isCompleted = false;
          if (!todo.Title) todo.Title = "";
          return todo;
        });

        setTodoList(fetchedTodos);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [])
  const addTodo = async (newTodo) => {
    setIsSaving(true);
    setErrorMessage("");

    const payload = {
      records: [
        {
          fields: {
            Title: newTodo.Title,            
            isCompleted: newTodo.isCompleted || false,
          },
        },
      ],
    };

    const options = {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText || `Error: ${resp.status}`);

      const { records } = await resp.json();

      const savedTodo = { id: records[0].id, ...records[0].fields };
      if (!savedTodo.isCompleted) savedTodo.isCompleted = false;
      if (!savedTodo.Title) savedTodo.Title = "";

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };


  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);

  
    setTodoList(todoList.map(todo => todo.id === editedTodo.id ? editedTodo : todo));

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            Title: editedTodo.Title,       
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText || `Error: ${resp.status}`);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

    
      const revertedTodos = todoList.map(todo =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    }
  };


  const completeTodo = async (id) => {
    const originalTodo = todoList.find(todo => todo.id === id);

  
    const updatedTodo = { ...originalTodo, isCompleted: true };
    setTodoList(todoList.map(todo => (todo.id === id ? updatedTodo : todo)));

    const payload = {
      records: [
        {
          id: id,
          fields: { Title: originalTodo.Title, isCompleted: true }, 
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText || `Error: ${resp.status}`);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      
      setTodoList(todoList.map(todo => (todo.id === id ? originalTodo : todo)));
    }
  };

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

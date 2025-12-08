import './App.css';
import React, { useState } from 'react';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function App() {
  const [newTodo, setNewTodo] = useState("Hello");

  return (
    <>
      <h1>MY Todo List</h1>

      <TodoForm />

    
      <p>{newTodo}</p>

      <TodoList />
    </>
  );
}

export default App;

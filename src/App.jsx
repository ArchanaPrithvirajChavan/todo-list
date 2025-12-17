import './App.css';
import React, { useState } from 'react';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function App() {
  const [todoList, setTodoList] = useState([]);
function addTodo(title){
  const newTodo={
    title:title,
    id:Date.now()
  }
  setTodoList([...todoList, newTodo])
}
  return (
    <>
      <h1>MY Todo List</h1>

      <TodoForm onAddTodo={addTodo}/>
    <TodoList todoList={todoList} />

    </>
  );
}

export default App;

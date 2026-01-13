import './App.css';
import React, { useState } from "react";
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';


function App() {
  const [todoList, setTodoList] = useState([]);

  
  function addTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map(todo =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);
  }

  
  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map(todo =>
      todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }

  return (
    <>
      <h1>MY Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo} 
      />
    </>
  );
}

export default App;

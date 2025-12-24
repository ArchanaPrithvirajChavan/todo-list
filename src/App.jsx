import './App.css';
import React, { useState } from 'react';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function App() {
  const [todoList, setTodoList] = useState([]);

  // Add new todo
  function addTodo(title) {
    const newTodo = {
      title: title,
      id: Date.now(),
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  }

  // Helper function to mark todo as complete
  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodoList(updatedTodos);
  }

  return (
    <>
      <h1>MY Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
      />
    </>
  );
}

export default App;

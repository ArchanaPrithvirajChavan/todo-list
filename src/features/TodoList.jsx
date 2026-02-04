import React from "react";
import TodoListItem from "./TodoListItem";
import styles from "./TodoList.module.css";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  
  if (isLoading) {
    return <p>Todo list loading...</p>;
  }

  
  if (todoList.length === 0) {
    return <p>No todos yet!</p>;
  }

  return (
    <ul className={styles.list}>
      {todoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;

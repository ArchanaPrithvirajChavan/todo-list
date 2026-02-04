import React, { useState, useEffect } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  
  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isEditing) return;
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  return (
    
    <li className={styles.item}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`edit-${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={(e) => setWorkingTitle(e.target.value)}
            />
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;

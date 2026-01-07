import React from "react";
import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo }) {

  // Remove completed todos
  const filteredTodoList = todoList.filter((todo) => {
    return todo.isCompleted === false;
  });

  return (
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;

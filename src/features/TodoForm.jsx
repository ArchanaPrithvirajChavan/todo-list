import React, { useState } from "react";

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workingTodoTitle.trim()) return;

    
    await onAddTodo({ title: workingTodoTitle, isCompleted: false });

    
    setWorkingTodoTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter new todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button
        type="submit"
        disabled={workingTodoTitle.trim() === "" || isSaving}
      >
        {isSaving ? "Saving..." : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;

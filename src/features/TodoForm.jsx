import React, { useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  gap: 8px;
`;

const StyledButton = styled.button`
  padding: 6px 10px;

  &:disabled {
    font-style: italic;
    opacity: 0.6;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workingTodoTitle.trim()) return;

    await onAddTodo({ title: workingTodoTitle, isCompleted: false });
    setWorkingTodoTitle("");
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter new todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />

      <StyledButton
        type="submit"
        disabled={workingTodoTitle.trim() === "" || isSaving}
      >
        {isSaving ? "Saving..." : "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;

import React, { useRef, useState } from 'react';

function TodoForm(props) {
  const [workingTodoTitle, setWorkingTodo] = useState("");
  const inputRef = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();

    props.onAddTodo(workingTodoTitle);
    setWorkingTodo("");
    inputRef.current.focus();
  }

  return (
    <>
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input
          type="text"
          id="todoTitle"
          name="title"
          ref={inputRef}
          value={workingTodoTitle}
          onChange={(event) => setWorkingTodo(event.target.value)}
        />

        <button type="submit" disabled={workingTodoTitle === ""}>
          Add Todo
        </button>
      </form>
    </>
  );
}

export default TodoForm;

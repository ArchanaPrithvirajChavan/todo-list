import React, { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm(props) {
  const [workingTodoTitle, setWorkingTodo] = useState("");
  const inputRef = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();
    props.onAddTodo(workingTodoTitle); // Add todo to parent state
    setWorkingTodo("");                
    inputRef.current.focus();          
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodo(event.target.value)}
        ref={inputRef}   
      />
      <button type="submit" disabled={workingTodoTitle === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;

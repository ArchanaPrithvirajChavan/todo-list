
import React, { useRef } from 'react';
function TodoForm(props){
    function handleAddTodo(event){
        event.preventDefault()
        const title=event.target.title.value;
        props.onAddTodo(title);            
    event.target.title.value = "";
    inputRef.current.focus();

    }
    const inputRef = useRef(null);

    return(
        <>
        <form onSubmit={handleAddTodo}>
         <label htmlFor="todoTitle">Todo</label>
         <input type="text" id="todoTitle" name="title" ref={inputRef} />

         <button type="submit">Add Todo</button>
        </form>
        </>
    )
}
export default TodoForm;

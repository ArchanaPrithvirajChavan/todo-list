import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function App() {
  return (
   <>
    <h1>MY Todo List</h1>
    <TodoForm/> 
      <TodoList />
    </>
  );
}

export default App;

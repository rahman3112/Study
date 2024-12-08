import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Timer from './component/timer'; 
import Todo from './component/todo';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Timer/>}/>
          <Route path='/todo' element={<Todo/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

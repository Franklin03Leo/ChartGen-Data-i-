import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Redirect,
  Link,
} from "react-router-dom";

import HomePage from './HomePage';
import Login from './Components/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/home" element={<HomePage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import Login from "./Components/Login";
import AdminView from "./Components/Admin";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<HomePage />} />
          {/* <Route exact path="/admin" element={<AdminView />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

/* eslint-disable no-unused-vars */
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./section/HomePage";
import UserData from "./Components/UserData";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/userData" element={<UserData />} />
      </Routes>
    </Router>
  );
}

export default App;

/* eslint-disable no-unused-vars */
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/section/HomePage";
import UserData from "./components/section/UserData";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<UserData />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClockIn from "../src/ClockInAndOut/ClockInComponent"; // Import your ClockIn component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClockIn />} />
      </Routes>
    </Router>
  );
}

export default App;

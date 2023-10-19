import React, { useEffect, useState } from "react";
import "../Style/workHistory.css"; // Import the CSS file

function WorkHistory({ name, clockInTime, clockOutTime }) {
  const [workHistory, setWorkHistory] = useState([]);
  const [workDuration, setWorkDuration] = useState(null);

  useEffect(() => {
    async function fetchWorkHistory() {
      try {
        const response = await fetch(`/workhistory/${name}`);
        if (response.ok) {
          const workHistory = await response.json();
          setWorkHistory(workHistory);
        } else {
          console.error("Failed to fetch work history.");
        }
      } catch (error) {
        console.error("Error fetching work history:", error);
      }
    }

    fetchWorkHistory();
  }, [name]);

  useEffect(() => {
    if (clockInTime && clockOutTime) {
      const diff = new Date(clockOutTime) - new Date(clockInTime);
      const durationInSeconds = Math.floor(diff / 1000);
      setWorkDuration(durationInSeconds);
    } else {
      setWorkDuration(0);
    }
  }, [clockInTime, clockOutTime]);

  return (
    <div className="work-history-container">
      <h2>Work History for {name}</h2>
      <p className="clock-time">
        Clock-In Time:{" "}
        {clockInTime
          ? new Date(clockInTime).toLocaleString()
          : "Not clocked in"}
      </p>
      <p className="clock-time">
        Clock-Out Time:{" "}
        {clockOutTime
          ? new Date(clockOutTime).toLocaleString()
          : "Not clocked out"}
      </p>
      <p className="worked-today">Worked Today: {workDuration} seconds</p>
      <ul>
        {workHistory.map((entry, index) => (
          <li key={index}>
            Date: {new Date(entry.date).toLocaleString()}, Duration:{" "}
            {entry.duration} seconds
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkHistory;

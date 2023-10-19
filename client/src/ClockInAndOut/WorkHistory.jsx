import React, { useEffect, useState } from 'react';
import '../Style/workHistory.css'; // Import the CSS file

function WorkHistory({ name }) {
  const [workHistory, setWorkHistory] = useState([]);

  useEffect(() => {
    async function fetchWorkHistory() {
      try {
        console.log('running');
        const response = await fetch(
          `http://localhost:5174/workhistory/${name}`
        );
        if (response.ok) {
          const workHistory = await response.json();
          setWorkHistory(workHistory);
        } else {
          console.error('Failed to fetch work history.');
        }
      } catch (error) {
        console.error('Error fetching work history:', error);
      }
    }

    fetchWorkHistory();
  }, [name]);

  console.log(workHistory);

  return (
    <div className='work-history-container'>
      <h2>Work History for {name}</h2>
      <div className='work-history-list'>
        {workHistory.map((entry, index) => (
          <div key={index}>
            <p>In: {new Date(entry.start).toLocaleString()}</p>
            <p>Out: {new Date(entry.end).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkHistory;

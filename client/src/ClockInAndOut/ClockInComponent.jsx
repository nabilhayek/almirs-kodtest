import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import WorkHistory from "./WorkHistory";
import "../Style/style.css";

function ClockInComponent() {
  const [employeeID, setEmployeeID] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);

  const handleClockIn = async () => {
    if (employeeID.trim() === "") {
      console.error("Employee ID is required.");
      return;
    }

    const response = await fetch("http://localhost:5174/clockin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: employeeID }),
    });

    if (response.ok) {
      console.log("Clock-in successful");
      setClockInTime(new Date());
      const newTimer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);

      setTimer(newTimer);
    } else {
      console.error("Clock-in failed");
    }
  };

  const handleClockOut = async () => {
    if (employeeID.trim() === "") {
      console.error("Employee ID is required.");
      return;
    }

    const response = await fetch("http://localhost:5174/clockout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: employeeID }),
    });

    if (response.ok) {
      clearInterval(timer);
      setTimer(null);
      setElapsedTime(0);

      setClockOutTime(new Date());
      setShowThankYouMessage(true);

      // Set a timer to hide the thank you message after 2 seconds
      setTimeout(() => {
        setShowThankYouMessage(false);
      }, 5000);
    } else {
      console.error("Clock-out failed");
    }
  };

  const openHistoryModal = () => {
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  return (
    <div className="container">
      <h1 className="header">Welcome to Your Dream Job</h1>
      <p className="paragraph">Enter your Employee ID to get started.</p>
      {elapsedTime !== 0 && (
        <p className="paragraph">Elapsed Time: {elapsedTime} seconds</p>
      )}
      <input
        className="input-field"
        type="text"
        placeholder="Employee ID"
        value={employeeID}
        onChange={e => setEmployeeID(e.target.value)}
      />
      <div className="button-group">
        <button className="button" onClick={handleClockIn}>
          Clock In
        </button>
        <button className="button" onClick={handleClockOut}>
          Clock Out
        </button>
        <button className="button" onClick={openHistoryModal}>
          History
        </button>
      </div>

      <Modal
        isOpen={isHistoryModalOpen}
        onRequestClose={closeHistoryModal}
        contentLabel="Work History Modal"
      >
        <WorkHistory
          name={employeeID}
          clockInTime={clockInTime}
          clockOutTime={clockOutTime}
        />
        <button onClick={closeHistoryModal} className="btn">
          Close
        </button>
      </Modal>

      {showThankYouMessage && (
        <div className="thank-you-message">
          Thank you for your work, have a nice day!👋
        </div>
      )}
    </div>
  );
}

export default ClockInComponent;

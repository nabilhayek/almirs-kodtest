import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import WorkHistory from './WorkHistory';
import '../Style/style.css';

function ClockInComponent() {
  // State variables
  const [employeeID, setEmployeeID] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);

  // Function to handle clock-in action
  const handleClockIn = async () => {
    if (employeeID.trim() === '') {
      console.error('Employee ID is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5174/clockin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: employeeID }),
      });

      if (response.ok) {
        console.log('Clock-in successful');
        setClockInTime(new Date());

        // Start the timer
        const newTimer = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);

        setTimer(newTimer);
      } else {
        console.error('Clock-in failed');
      }
    } catch (error) {
      console.error('An error occurred during clock-in:', error);
    }
  };

  // Function to handle clock-out action
  const handleClockOut = async () => {
    if (employeeID.trim() === '') {
      console.error('Employee ID is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5174/clockout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: employeeID }),
      });

      if (response.ok) {
        clearInterval(timer);
        setTimer(null);
        setElapsedTime(0);
        setClockOutTime(new Date());
        setShowThankYouMessage(true);

        setTimeout(() => {
          setShowThankYouMessage(false);
        }, 5000);
      } else {
        console.error('Clock-out failed');
      }
    } catch (error) {
      console.error('An error occurred during clock-out:', error);
    }
  };

  // Function to open the history modal
  const openHistoryModal = () => {
    setIsHistoryModalOpen(true);
  };

  // Function to close the history modal
  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  // Render component
  return (
    <div className='container'>
      <h1 className='header'>Welcome to Your Dream Job</h1>
      <p className='paragraph'>Enter your Employee ID to get started.</p>
      {elapsedTime !== 0 && (
        <p className='paragraph'>Elapsed Time: {elapsedTime} seconds</p>
      )}
      <input
        className='input-field'
        type='text'
        placeholder='Employee ID'
        value={employeeID}
        onChange={(e) => setEmployeeID(e.target.value)}
      />
      <div className='button-group'>
        <button className='button' onClick={handleClockIn}>
          Clock In
        </button>
        <button className='button' onClick={handleClockOut}>
          Clock Out
        </button>
        <button className='button' onClick={openHistoryModal}>
          History
        </button>
      </div>

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onRequestClose={closeHistoryModal}
        contentLabel='Work History Modal'
      >
        <WorkHistory name={employeeID} />
        <button onClick={closeHistoryModal} className='btn'>
          Close
        </button>
      </Modal>

      {/* Thank You Message */}
      {showThankYouMessage && (
        <div className='thank-you-message'>
          Thank you for your work, have a nice day!👋
        </div>
      )}
    </div>
  );
}

export default ClockInComponent;

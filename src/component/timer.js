// Timer.js
import './timer.css';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Axios to make HTTP requests
// import Todo from './todo';
import { useNavigate } from 'react-router-dom';



const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [points, setPoints] = useState(0);

  // Fetch points from the backend when the component is mounted
  useEffect(() => {
    // Get the saved points from the backend
    axios.get('http://https://study-backend-k311.onrender.com/api/getPoints')
      .then(response => {
        setPoints(response.data.points); // Set the fetched points
      })
      .catch(error => {
        console.error('Error fetching points:', error);
      });
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const reset = async () => {
    // Calculate total seconds (sec = total time)
    const totalSeconds = seconds;

    // Update points
    const newPoints = totalSeconds * 0.01;
    setPoints((prevPoints) => prevPoints + newPoints);

    // Send the points to the backend and store it in MongoDB
    try {
      await axios.post('http://localhost:5000/api/savePoints', { points: newPoints });
      console.log('Points saved successfully!');
    } catch (error) {
      console.error('Error saving points:', error);
    }

    // Reset timer
    setSeconds(0);
    setIsActive(false);
  };

  // Convert seconds to hh:mm:ss
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Format the time (with leading zeros if needed)
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  const navigate = useNavigate(); 
  return (
    <>
      <div className="clock-container">
        <div className='wallet' style={{ border: '1px solid white', height: '60px', width: '130px', position: 'relative', top: '-40px', borderRadius: '7px' }}>
          <h2 style={{ position: 'relative', top: '-15px', color: '#C5C6C7' }}>WALLET</h2>
          <h4>${points.toFixed(2)}</h4>
        </div>
        <h1>STUDYTIMER</h1>
        <div className="clock">
          <div
            className="second-hand"
            style={{
              transform: `rotate(${(seconds % 60) * 6}deg)`, // Rotate the second hand every second
            }}
          ></div>
        </div>
        <h2>{formattedTime}</h2>
        <div className="buttons">
          <button onClick={() => setIsActive(!isActive)}>
            {isActive ? 'PAUSE' : 'START'}
          </button>
          <button onClick={reset}>FINISH</button>
          <button style={{}} onClick={() => navigate('/todo')}>TODO LIST</button>
        </div>
      </div>
    </>
  );
};

export default Timer;

import React from 'react';
import { useState } from 'react';
import MapComponent from "./components/MapComponent";
import Input from "./components/Input";
import axios from 'axios';

export default function App() {
  const [anchors, setAnchors] = useState([]);

  function addAnchor(idNumber) {
    const fakePositions = {
      1: { x: 50, y: 50 },
      2: { x: 300, y: 50 },
      3: { x: 175, y: 250 }
    };

    const positionForThisAnchor = fakePositions[idNumber];

    const newAnchor = {
      id: idNumber,
      x: positionForThisAnchor.x,
      y: positionForThisAnchor.y,
    };

    setAnchors(function (previousAnchors) {
      const anchorsWithoutThisId = previousAnchors.filter(function (anchor) {
        return anchor.id !== idNumber;
      });

      return [...anchorsWithoutThisId, newAnchor];
    });
  }

  const checkbackend = () => {
    axios.get('http://localhost:5000').then((response) => {
      console.log(response.data);
    });
  };
  const calculatePosition = () => {
    if (anchors.length < 3) {
      alert("Please add all 3 anchors first!");
      return;
    }


    axios.post('http://localhost:5000/calculate', { anchors })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // For now, let's just alert the answer the backend gave us
          alert(`The Backend says you are at X: ${response.data.x.toFixed(2)}, Y: ${response.data.y.toFixed(2)}`);
        }
      })
      .catch((err) => {
        console.error("Calculation failed", err);
      });
  };

  return (
    <div>
      <h1>WSN Node Locator</h1>
      <button onClick={checkbackend}>test backend</button>
      <button
        onClick={calculatePosition}
        style={{ backgroundColor: '#4CAF50', color: 'white', marginLeft: '10px' }}
      >
        Run Trilateration
      </button>

      <MapComponent anchors={anchors} />

      <div style={{ marginTop: '20px' }}>
        <Input onAdd={addAnchor} />
      </div>
    </div>
  );
}
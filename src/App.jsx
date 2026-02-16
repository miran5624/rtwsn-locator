import React from 'react';
import { useState } from 'react';
import MapComponent from "./components/MapComponent";
import Input from "./components/Input";
import axios from 'axios';

export default function App() {
  const [anchors, setAnchors] = useState([]);

  function addAnchor(anchorData) {




    const newAnchor = {
      id: anchorData.id,
      x: anchorData.x,
      y: anchorData.y,
    };

    setAnchors(function (previousAnchors) {
      const anchorsWithoutThisId = previousAnchors.filter(function (anchor) {
        return anchor.id !== anchorData.id;
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
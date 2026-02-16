import React, { useState } from 'react';

function Input({ onAdd }) {

    const [formData, setFormData] = useState({
        id: '',
        x: '',
        y: ''
    });

    const handleAddAnchor = () => {
        if (formData.id && formData.x && formData.y) {
            onAdd({
                id: Number(formData.id),
                x: Number(formData.x),
                y: Number(formData.y)
            });

            setFormData({ id: "", x: "", y: "" });
        } else {
            alert("Please fill in ID, X, and Y coordinates!");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddAnchor();
        }
    };

    const handleIdChange = (e) => setFormData(prev => ({ ...prev, id: e.target.value }));
    const handleXChange = (e) => setFormData(prev => ({ ...prev, x: e.target.value }));
    const handleYChange = (e) => setFormData(prev => ({ ...prev, y: e.target.value }));

    return (
        <div className="inputfield">
            <input
                placeholder='ID'
                onChange={handleIdChange}
                onKeyDown={handleKeyDown}
                value={formData.id}
                type="number"
                style={{ width: '60px', marginRight: '5px' }}
            />
            <input
                placeholder='X'
                onChange={handleXChange}
                onKeyDown={handleKeyDown}
                value={formData.x}
                type="number"
                style={{ width: '60px', marginRight: '5px' }}
            />
            <input
                placeholder='Y'
                onChange={handleYChange}
                onKeyDown={handleKeyDown}
                value={formData.y}
                type="number"
                style={{ width: '60px', marginRight: '5px' }}
            />
            <button onClick={handleAddAnchor}>
                Enter
            </button>
        </div>
    );
}

export default Input;
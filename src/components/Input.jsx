import React from 'react';

function Input(props) {
    const handleAddAnchor = props.onAdd;

    return (
        <>
            <div className="inputfield1">
                <button onClick={function () {
                    handleAddAnchor(1);
                }}>
                    Add Anchor 1
                </button>
            </div>

            <div className="inputfield2">
                <button onClick={function () {
                    handleAddAnchor(2);
                }}>
                    Add Anchor 2
                </button>
            </div>

            <div className="inputfield3">
                <button onClick={function () {
                    handleAddAnchor(3);
                }}>
                    Add Anchor 3
                </button>
            </div>
        </>
    );
}

export default Input;
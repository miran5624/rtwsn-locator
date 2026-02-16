import React from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';

function MapComponent(props) {
  const anchors = props.anchors;

  const canvasWidth = window.innerWidth - 50;
  const canvasHeight = 400;

  const anchorElements = anchors.map(function (anchor) {
    return (
      <React.Fragment key={anchor.id}>
        <Circle
          x={anchor.x}
          y={anchor.y}
          radius={10}
          fill="red"
          stroke="black"
          strokeWidth={2}
        />

        <Text
          x={anchor.x - 5}
          y={anchor.y - 5}
          text={anchor.id}
          fontSize={15}
          fill="white"
          fontStyle="bold"
        />
      </React.Fragment>
    );
  });

  return (
    <div style={{ border: '2px solid black', margin: '20px' }}>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {anchorElements}
        </Layer>
      </Stage>
    </div>
  );
}

export default MapComponent;
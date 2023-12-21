import React, { useState, useEffect } from 'react';
import readMedmontBitmap from '../../utils/readMedmontBitmap'; // Adjust the import path as necessary

const ImageDisplay = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    readMedmontBitmap()
      .then((croppedImage) => {
        setImageSrc(croppedImage.src);
      })
      .catch((error) => {
        console.error('Error processing bitmap:', error);
      });
  }, []); // Empty dependency array ensures this runs only once
  // State to hold ellipse properties
  const [ellipse, setEllipse] = useState({
    x: 110, // Initial x position
    y: 110, // Initial y position
    width: 500, // Initial width
    height: 200, // Initial height
  });

  return (
    <div style={{ position: 'relative' }}>
      <img src={imageSrc} alt="Overlay" />
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse
          cx={ellipse.x}
          cy={ellipse.y}
          rx={ellipse.width / 2}
          ry={ellipse.height / 2}
          style={{ fill: 'transparent', stroke: 'red' }}
          // ... Attach mouse event handlers here ...
        />
        {/* You can also add a small rectangle or circle at the corner of the ellipse for resize handle */}
      </svg>
    </div>
  );
};

export default ImageDisplay;

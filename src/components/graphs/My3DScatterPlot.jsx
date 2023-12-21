import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
const My3DScatterPlot = ({ dataPoints }) => {
  // Prepare data for Plotly for scatter plot
  const trace = {
    x: dataPoints.map((p) => p.x),
    y: dataPoints.map((p) => p.y),
    z: dataPoints.map((p) => p.z),
    mode: 'markers',
    type: 'scatter3d',
    marker: {
      size: 1,
      opacity: 0.8,
    },
  };

  const layout = {
    title: '3D Scatter Plot',
    scene: {
      xaxis: { title: 'X Axis', range: [-6, 6] },
      yaxis: { title: 'Y Axis', range: [-6, 6] },
      zaxis: { title: 'Z Axis', range: [-4, 0] },
      aspectmode: 'manual',
      aspectratio: {
        x: 1,
        y: 1,
        z: 0.75,
      },
    },
    autosize: true,
  };

  // prepare data for surface plot
  // Extract unique x and y values
  const uniqueX = [...new Set(dataPoints.map((p) => p.x))].sort(
    (a, b) => a - b,
  );
  const uniqueY = [...new Set(dataPoints.map((p) => p.y))].sort(
    (a, b) => a - b,
  );

  // Create z grid
  let zGrid = new Array(uniqueY.length)
    .fill(0)
    .map(() => new Array(uniqueX.length).fill(0));
  dataPoints.forEach((point) => {
    const xIndex = uniqueX.indexOf(point.x);
    const yIndex = uniqueY.indexOf(point.y);
    zGrid[yIndex][xIndex] = point.z;
  });

  const traceSurface = {
    x: uniqueX,
    y: uniqueY,
    z: zGrid,
    type: 'surface',
  };

  const layoutSurface = {
    title: '3D Surface Plot',
    scene: {
      xaxis: { title: 'X Axis', range: [-6, 6] },
      yaxis: { title: 'Y Axis', range: [-6, 6] },
      zaxis: { title: 'Z Axis', range: [-3, 0] },
      aspectmode: 'manual',
      aspectratio: {
        x: 1,
        y: 1,
        z: 0.25,
      },
    },
    autosize: true,
  };

  // display the plots
  return (
    <div>
      {/* <Plot
        data={[trace]}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
      /> */}
      <Plot
        data={[traceSurface]}
        layout={layoutSurface}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

My3DScatterPlot.propTypes = {
  dataPoints: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default My3DScatterPlot;

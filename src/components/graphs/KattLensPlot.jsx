import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import PropTypes from 'prop-types';
import { useKattLenses } from '../hooks/KattLensContext';

const KattLensPlot = ({ scale }) => {
  // find the max and min values of x and y in the KattLenses
  const { kattLenses } = useKattLenses();
  const lens1 = kattLenses.lens1;
  const lens2 = kattLenses.lens2;

  const xMax1 = lens1.maxX;
  const xMin1 = lens1.minX;
  const yMax1 = lens1.maxY;
  const yMin1 = lens1.minY;

  const xMax2 = lens2.maxX;
  const xMin2 = lens2.minX;
  const yMax2 = lens2.maxY;
  const yMin2 = lens2.minY;

  const xMax = Math.max(xMax1, xMax2);
  const xMin = Math.min(xMin1, xMin2);
  const yMax = Math.max(yMax1, yMax2);
  const yMin = Math.min(yMin1, yMin2);

  const xValues = datasets.map((dataset) =>
    dataset.data.map((point) => point.x),
  );
  const yValues = datasets.map((dataset) =>
    dataset.data.map((point) => point.y),
  );
  const xMax = Math.max(...xValues.flat());
  const xMin = Math.min(...xValues.flat());
  const yMax = Math.max(...yValues.flat());
  const yMin = Math.min(...yValues.flat());
  // set the domain of the X and Y axes to be the max and min values of x and y rounded to the nearest 2
  // so the axes are always the same size and the graph doesn't jump around when zooming in and out
  const xDomain = [Math.floor(xMin / 2) * 2 - 2, Math.ceil(xMax / 2) * 2];
  const yDomain = [Math.floor(yMin / 2) * 2, Math.ceil(yMax / 2) * 2];
  const xRange = xDomain[1] - xDomain[0];
  const yRange = yDomain[1] - yDomain[0];
  const aspectRatio = xRange / yRange;
  const chartHeight = 500 * scale;
  const chartWidth = chartHeight * aspectRatio;

  // Generate ticks for X and Y axes
  const xTicks = [];
  for (let i = xDomain[0]; i <= xDomain[1]; i += 2) {
    xTicks.push(i);
  }

  const yTicks = [];
  for (let i = yDomain[0]; i <= yDomain[1]; i += 2) {
    yTicks.push(i);
  }
  return (
    <LineChart
      width={chartWidth}
      height={chartHeight}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis
        dataKey="x"
        type="number"
        domain={[xDomain[0], xDomain[1]]}
        ticks={xTicks}
      />
      <YAxis domain={[yDomain[0], yDomain[1]]} ticks={yTicks} />
      <CartesianGrid strokeDasharray="2 4" fill="#353535" />
      <Legend />
      {datasets.map((dataset, index) => (
        <Line
          key={index}
          type="monotone"
          data={dataset.data}
          dataKey="y"
          stroke={dataset.strokeColour || '#ff7300'}
          yAxisId={0}
          dot={false} // Hide the dots on the line
          name={dataset.label}
        />
      ))}
      {datasets.flatMap((dataset, datasetIndex) =>
        (dataset.referenceYs || []).map((yValue, idx) => (
          <ReferenceLine
            key={`ref-${datasetIndex}-${idx}`}
            y={yValue}
            stroke={dataset.strokeColour || '#f007300'}
            strokeDasharray="1 4"
            label={{
              value: `${yValue}`,
              position: dataset.referenceYPosition || `insideLeft`,
              style: {
                fontSize: 10 * scale, // Small font size
                fill: dataset.strokeColour || '#f007300', // Font color
                fontWeight: 'bold',
              },
            }}
          />
        )),
      )}
      {datasets.flatMap((dataset, datasetIndex) =>
        (dataset.referenceXs || []).map((xValue, idx) => (
          <ReferenceLine
            key={`ref-x-${datasetIndex}-${idx}`}
            x={xValue}
            stroke={dataset.strokeColour || '#f007300'}
            strokeDasharray="1 4"
            label={{
              value: `${dataset.referenceXLabels[idx]}`,
              position: dataset.referenceXPosition || `insideTop`,
              style: {
                fontSize: 10 * scale, // Small font size
                fill: dataset.strokeColour || '#f007300', // Font color
                fontWeight: 'bold',
              },
            }}
          />
        )),
      )}
    </LineChart>
  );
};

BetaLensPlot.propTypes = {
  scale: PropTypes.number.isRequired,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      strokeColour: PropTypes.string,
      label: PropTypes.string,
      referenceYs: PropTypes.arrayOf(PropTypes.number),
      referenceXs: PropTypes.arrayOf(PropTypes.number),
      referenceYPosition: PropTypes.string,
      referenceXPosition: PropTypes.string,
      referenceYLabels: PropTypes.arrayOf(PropTypes.string),
      referenceXLabels: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
};

export default KattLensPlot;

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
import { useKattLenses } from '../../hooks/useKattLenses';
import { getDomainOfLensPair } from '../../utils/lensDesigns';

const KattLensPlot = ({ scale, plotWidth }) => {
  // get the KattLenses from the global context
  const { kattLenses } = useKattLenses();
  const lens1 = kattLenses.lens1;
  const lens2 = kattLenses.lens2;

  // Generate the datasets for the plot
  const datasets = [
    {
      data: lens1.points,
      strokeColour: lens1.color,
      label: lens1.lensParametersString(),
      // referenceYs: kattDesign.referenceLinesY.refPoints,
      // referenceXs: kattDesign.referenceLinesX.refPoints,
      // referenceYPosition: 'insideLeft',
      // referenceXPosition: 'insideTop',
      // referenceYLabels: kattDesign.referenceLinesY.refLabels,
      // referenceXLabels: kattDesign.referenceLinesX.refLabels,
    },
    {
      data: lens2.points,
      strokeColour: lens2.color,
      label: lens2.lensParametersString(),
      // referenceYs: kattDesign2.referenceLinesY.refPoints,
      // referenceXs: kattDesign2.referenceLinesX.refPoints,
      // referenceYPosition: 'insideLeft',
      // referenceXPosition: 'insideBottom',
      // referenceYLabels: kattDesign2.referenceLinesY.refLabels,
      // referenceXLabels: kattDesign2.referenceLinesX.refLabels,
    },
  ];

  // find the max and min values of x and y in the KattLenses
  const domain = getDomainOfLensPair(lens1, lens2);
  const xDomain = domain.xDomain;
  const yDomain = domain.yDomain;

  const xRange = xDomain[1] - xDomain[0];
  const yRange = yDomain[1] - yDomain[0];

  const aspectRatio = xRange / yRange;
  const chartWidth = plotWidth;
  const chartHeight = chartWidth / aspectRatio;

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

      {/* {datasets.flatMap((dataset, datasetIndex) =>
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
      )} */}
      {/* 
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
      )} */}
    </LineChart>
  );
};

KattLensPlot.propTypes = {
  scale: PropTypes.number.isRequired,
  plotWidth: PropTypes.number.isRequired,
};

export default KattLensPlot;

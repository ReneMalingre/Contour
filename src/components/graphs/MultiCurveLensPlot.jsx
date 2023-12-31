import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useMultiCurveLenses } from '../../hooks/useMultiCurveLenses';
import { getDomainOfLensPair } from '../../utils/lensDesigns';
import { useRef, useState, useEffect } from 'react';

const MultiCurveLensPlot = () => {
  // Stuff to get the dimensions correct
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // get the MultiCurveLenses from the global context
  const { MultiCurveLenses } = useMultiCurveLenses();
  const lens1 = MultiCurveLenses.lens1;
  const lens2 = MultiCurveLenses.lens2;

  const bands1 = lens1.referenceLinesForBands();
  const bands2 = lens2.referenceLinesForBands();
  // console.log(`bands1: ${JSON.stringify(bands1)}`);

  // Generate the datasets for the plot
  const datasets = [
    {
      data: lens1.points,
      strokeColour: lens1.color,
      label: lens1.lensParametersString(),
    },
    {
      data: lens2.points,
      strokeColour: lens2.color,
      label: lens2.lensParametersString(),
    },
  ];

  // find the max and min values of x and y in the MultiCurveLenses
  const domain = getDomainOfLensPair(lens1, lens2);
  const xDomain = domain.xDomain;
  const yDomain = domain.yDomain;

  const xRange = xDomain[1] - xDomain[0];
  const yRange = yDomain[1] - yDomain[0];

  const aspectRatio = xRange / yRange;

  // more stuff to get the dimensions correct
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].target) return;
      const newWidth = entries[0].target.getBoundingClientRect().width;
      setContainerWidth(newWidth);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

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
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {containerWidth > 0 && (
        <ResponsiveContainer width="100%" height={containerWidth / aspectRatio}>
          <LineChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="x"
              type="number"
              domain={[xDomain[0], xDomain[1]]}
              ticks={xTicks}
            />
            <YAxis domain={[yDomain[0], yDomain[1]]} ticks={yTicks} />
            <CartesianGrid strokeDasharray="1 9" fill="#222" />
            <Legend verticalAlign="bottom" align="center" />
            {datasets.map((dataset, index) => (
              <Line
                key={`MultiCurveLens-${index}`}
                type="monotone"
                data={dataset.data}
                dataKey="y"
                stroke={dataset.strokeColour || '#fff'}
                yAxisId={0}
                dot={false} // Hide the dots on the line
                name={dataset.label}
              />
            ))}

            {bands1.refPoints.map((point, index) => (
              <ReferenceLine
                key={`band1-${index}`}
                y={point}
                label={{
                  value: `${bands1.refLabels[index]}`,
                  position: `insideLeft`,
                  style: {
                    fontSize: 14, // Small font size
                    fill: lens1.color || '#ffff00', // Font color
                    fontWeight: 'bold',
                  },
                }}
                stroke={lens1.color || 'red'}
                strokeDasharray="1 4"
              />
            ))}
            {lens1.lensDiameter == lens2.lensDiameter ? (
              <></>
            ) : (
              <>
                {bands2.refPoints.map((point, index) => (
                  <ReferenceLine
                    key={`band2-${index}`}
                    y={point}
                    label={{
                      value: `${bands2.refLabels[index]}`,
                      position: `insideRight`,
                      style: {
                        fontSize: 14, // Small font size
                        fill: lens2.color || '#ffff00', // Font color
                        fontWeight: 'bold',
                      },
                    }}
                    stroke={lens2.color || 'yellow'}
                    strokeDasharray="1 4"
                  />
                ))}{' '}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

MultiCurveLensPlot.propTypes = {};

export default MultiCurveLensPlot;

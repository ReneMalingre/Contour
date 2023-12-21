import getTestXmlData from '../assets/xmlFiles/testEye';
import { tan, pi } from 'mathjs';
function readTestHeightData(ignoreMissingData = true) {
  const xmlString = getTestXmlData();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const rows = parseInt(xmlDoc.getElementsByTagName('Rows')[0].textContent);
  const cols = parseInt(xmlDoc.getElementsByTagName('Cols')[0].textContent);
  const missingDataValue = parseFloat(
    xmlDoc.getElementsByTagName('MissingDataValue')[0].textContent,
  );
  const lowestValue = parseFloat(
    xmlDoc.getElementsByTagName('MinimumValue')[0].textContent,
  );
  const dataString = xmlDoc.getElementsByTagName('Data')[0].textContent.trim();
  const cleanedString = dataString
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ');
  // Parsing the BoundingRect
  const boundingRect = {
    low: {
      x: parseFloat(
        xmlDoc
          .getElementsByTagName('BoundingRect')[0]
          .getElementsByTagName('Low')[0]
          .getElementsByTagName('X')[0].textContent,
      ),
      y: parseFloat(
        xmlDoc
          .getElementsByTagName('BoundingRect')[0]
          .getElementsByTagName('Low')[0]
          .getElementsByTagName('Y')[0].textContent,
      ),
    },
    high: {
      x: parseFloat(
        xmlDoc
          .getElementsByTagName('BoundingRect')[0]
          .getElementsByTagName('High')[0]
          .getElementsByTagName('X')[0].textContent,
      ),
      y: parseFloat(
        xmlDoc
          .getElementsByTagName('BoundingRect')[0]
          .getElementsByTagName('High')[0]
          .getElementsByTagName('Y')[0].textContent,
      ),
    },
  };

  const worldCoords = {
    low: {
      x: parseFloat(
        xmlDoc
          .getElementsByTagName('WorldCoords')[0]
          .getElementsByTagName('Low')[0]
          .getElementsByTagName('X')[0].textContent,
      ),
      y: parseFloat(
        xmlDoc
          .getElementsByTagName('WorldCoords')[0]
          .getElementsByTagName('Low')[0]
          .getElementsByTagName('Y')[0].textContent,
      ),
    },
    high: {
      x: parseFloat(
        xmlDoc
          .getElementsByTagName('WorldCoords')[0]
          .getElementsByTagName('High')[0]
          .getElementsByTagName('X')[0].textContent,
      ),
      y: parseFloat(
        xmlDoc
          .getElementsByTagName('WorldCoords')[0]
          .getElementsByTagName('High')[0]
          .getElementsByTagName('Y')[0].textContent,
      ),
    },
  };
  const dataPoints = cleanedString.split(' ').map((value) => parseFloat(value));
  const pointsArray = [];
  const xStep = (worldCoords.high.x - worldCoords.low.x) / (cols - 1);
  const yStep = (worldCoords.high.y - worldCoords.low.y) / (rows - 1);
  console.log(`boundingRect: ${JSON.stringify(worldCoords)}`);
  console.log(`xStep: ${xStep}`);
  console.log(`yStep: ${yStep}`);

  for (let row = 0; row < rows; row++) {
    // console.log(`**** New Row ${row}`);
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const zValue = dataPoints[index];

      if (zValue !== missingDataValue) {
        // const xValue = boundingRect.low.x + col * xStep;
        // const yValue = boundingRect.low.y + row * yStep;
        const xValue = worldCoords.low.x + col * xStep;
        const yValue = worldCoords.low.y + row * yStep;
        pointsArray.push({ x: xValue, y: yValue, z: zValue });
      } else {
        if (!ignoreMissingData) {
          // push it to the lowest value in the data
          const xValue = worldCoords.low.x + col * xStep;
          const yValue = worldCoords.low.y + row * yStep;
          pointsArray.push({ x: xValue, y: yValue, z: lowestValue });
        }
      }
    }
  }

  return pointsArray;
}

function findApexOfCornea(pointsArray) {
  // find the highest point in the pointsArray

  // Find the highest z-value
  const maxZ = Math.max(...pointsArray.map((point) => point[2]));

  // Filter points with the highest z-value
  const apexPoints = pointsArray.filter((point) => point[2] === maxZ);

  // Calculate the average x and y if there are multiple apex points
  const avgX = apexPoints.reduce((sum, p) => sum + p[0], 0) / apexPoints.length;
  const avgY = apexPoints.reduce((sum, p) => sum + p[1], 0) / apexPoints.length;
  const origin = [avgX, avgY, maxZ];
  return origin;
}

function findNearestPointsToLineFromApex(
  pointsArray,
  apexPoint,
  degreesFromXAxis,
  distanceFromApex,
  boundsForChecking,
) {
  const slope = tan((degreesFromXAxis * pi) / 180);
  const yIntercept = apexPoint.y - slope * apexPoint.x;

  // get the x,y of the point on the line that is distanceFromApex from the apexPoint
  const x =
    (apexPoint.x + slope * apexPoint.y - slope * yIntercept) / (1 + slope ** 2);
  const y = slope * x + yIntercept;
  const referencePointOnLine = { x: x, y: y };

  const rangeLow = distanceFromApex - boundsForChecking / 2;
  const rangeHigh = distanceFromApex + boundsForChecking / 2;

  let pointsOnLine = [];
  const pointsCloserAndAbove = [];
  const pointsCloserAndBelow = [];
  const pointsFurtherAndAbove = [];
  const pointsFurtherAndBelow = [];

  for (let point of pointsArray) {
    const distanceFromLine =
      Math.abs(slope * point.x - point.y + yIntercept) /
      Math.sqrt(slope ** 2 + 1);
    const distanceFromApexPoint = Math.sqrt(
      (point.x - apexPoint.x) ** 2 + (point.y - apexPoint.y) ** 2,
    );

    const isAboveLine = point.y > slope * point.x + yIntercept;
    const isOnLine = point.y === slope * point.x + yIntercept;

    if (isOnLine) {
      pointsOnLine.push(point);
    }
    if (
      distanceFromApexPoint <= distanceFromApex &&
      distanceFromLine >= rangeLow &&
      distanceFromLine <= rangeHigh
    ) {
      if (isAboveLine) pointsCloserAndAbove.push(point);
      else pointsCloserAndBelow.push(point);
    } else if (
      distanceFromApexPoint > distanceFromApex &&
      distanceFromLine >= rangeLow &&
      distanceFromLine <= rangeHigh
    ) {
      if (isAboveLine) pointsFurtherAndAbove.push(point);
      else pointsFurtherAndBelow.push(point);
    }
  }

  // Check if we have enough valid points on the line itself
  if (pointsOnLine.length < 2) {
    pointsOnLine = [];
  } else {
    if (pointsOnLine.length > 2) {
      // find the two points from pointsOnLine that are closest to the distanceFromApex
      pointsOnLine.sort((a, b) => {
        const distanceA = Math.sqrt(
          (a.x - referencePointOnLine.x) ** 2 +
            (a.y - referencePointOnLine.y) ** 2,
        );
        const distanceB = Math.sqrt(
          (b.x - referencePointOnLine.x) ** 2 +
            (b.y - referencePointOnLine.y) ** 2,
        );
        return distanceA - distanceB;
      });
      pointsOnLine = [pointsOnLine[0], pointsOnLine[1]];
    }
  }

  // Check for enough points in each category
  if (
    pointsCloserAndAbove.length === 0 ||
    pointsCloserAndBelow.length === 0 ||
    pointsFurtherAndAbove.length === 0 ||
    pointsFurtherAndBelow.length === 0
  ) {
    return { pointsCloser: [], pointsFurther: [], pointsOnLine: pointsOnLine };
  }

  // Return the points in the specified format
  return {
    pointsCloser: [pointsCloserAndAbove[0], pointsCloserAndBelow[0]],
    pointsFurther: [pointsFurtherAndAbove[0], pointsFurtherAndBelow[0]],
    pointsOnLine: pointsOnLine,
  };
}
// transformPoints takes the apex point and two points on the line and
// transforms them to a new coordinate system where the apex is at (0,0)
// and the other two points are at (x, y) and (x', y')
function transformPoints(apex, point1, point2) {
  const distance2D = (p1, p2) =>
    Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

  return [
    { x: 0, y: 0 }, // Transformed apex
    { x: distance2D(apex, point1), y: point1.z - apex.z },
    { x: distance2D(apex, point2), y: point2.z - apex.z },
  ];
}

// given three points on a circle, find the center and radius
// there are some edge cases that are not handled here
function findCircleCenter(points) {
  const midAB = {
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2,
  };
  const midBC = {
    x: (points[1].x + points[2].x) / 2,
    y: (points[1].y + points[2].y) / 2,
  };

  const slopeAB = (points[1].y - points[0].y) / (points[1].x - points[0].x);
  const slopeBC = (points[2].y - points[1].y) / (points[2].x - points[1].x);

  const slopePerpAB = -1 / slopeAB;
  const slopePerpBC = -1 / slopeBC;

  const cAB = midAB.y - slopePerpAB * midAB.x;
  const cBC = midBC.y - slopePerpBC * midBC.x;

  const centerX = (cBC - cAB) / (slopePerpAB - slopePerpBC);
  const centerY = slopePerpAB * centerX + cAB;

  const radius = Math.sqrt(
    (points[0].x - centerX) ** 2 + (points[0].y - centerY) ** 2,
  );

  return { center: { x: centerX, y: centerY }, radius: radius };
}

// given a circle and a distance from the apex, find the z-value
// I don't think this bit is correct, but we'll test it out
function interpolateZValue(circle, distanceFromApex) {
  const dx = distanceFromApex - circle.center.x;
  const dy = Math.sqrt(circle.radius ** 2 - dx ** 2);

  return dy * Math.sign(circle.center.y);
  // // Example usage
  // const apex = { x: apexX, y: apexY, z: apexZ };
  // const point1 = { x: point1X, y: point1Y, z: point1Z };
  // const point2 = { x: point2X, y: point2Y, z: point2Z };

  // const transformedPoints = transformPoints(apex, point1, point2);
  // const circle = findCircleCenter(transformedPoints);
  // const zValue = interpolateZValue(circle, distanceFromApex);

  // console.log('Interpolated Z-Value:', zValue);
}
function getOriginalCoordinates(
  apex,
  degreesFromXAxis,
  distanceFromApex,
  zValue,
) {
  const angleRad = (degreesFromXAxis * Math.PI) / 180;

  // Calculate the original x and y coordinates
  const originalX = apex.x + distanceFromApex * Math.cos(angleRad);
  const originalY = apex.y + distanceFromApex * Math.sin(angleRad);

  // The original z coordinate is the apex's z plus the interpolated z-value
  const originalZ = apex.z + zValue;

  return { x: originalX, y: originalY, z: originalZ };
}

// // Assuming you have these values from previous calculations
// const apex = { x: apexX, y: apexY, z: apexZ };
// const degreesFromXAxis = 10; // example angle
// const distanceFromApex = 100; // example distance
// const zValue = interpolateZValue(circle, distanceFromApex);

// // Get the original coordinates
// const originalCoordinates = getOriginalCoordinates(apex, degreesFromXAxis, distanceFromApex, zValue);

// console.log('Original Coordinates:', originalCoordinates);

export {
  readTestHeightData,
  findApexOfCornea,
  findNearestPointsToLineFromApex,
};

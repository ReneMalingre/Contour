function generateLensPoints(radii, eValues, widths) {
  const points = [];
  const referenceLinesY = { refPoints: [], refLabels: [] };
  const referenceLinesX = { refPoints: [], refLabels: [] };
  let x = 0;
  let y = 0;

  // Generate points for each segment
  for (let i = 0; i < widths.length; i++) {
    const width = widths[i];
    referenceLinesY.refPoints.push(width / 2);
    referenceLinesY.refLabels.push(width / 2);

    const radius = radii[i];
    const e = eValues[i];
    if (i > 0) {
      // calculate the starting point x-value for the next segment
      const lastPoint = points[points.length - 1];
      y = lastPoint.y;
      const sagAtStartOfSegment = calculateSag(radius, e, y);
      x = lastPoint.x - sagAtStartOfSegment;
    }

    const segmentPoints = generateConicSectionPoints(radius, e, width, y);

    // Offset x and y for each segment
    for (let j = 0; j < segmentPoints.length; j++) {
      const point = segmentPoints[j];
      point.x += x; // add the x offset for this segment so the segments join up
      points.push(point);
    }
  }

  return {
    points: points,
    referenceLinesY: referenceLinesY,
    referenceLinesX: referenceLinesX,
  };
}

function generateConicSectionPoints(radius, e, chordWidth, yOffset = 0) {
  // radius is the apical radius of the conic section in mm
  // e is the conic constant, a non-negative real number
  //      if e = 0, the conic section is a circle
  //      if e = 1, the conic section is a parabola
  //      if e < 1 and > 0, the conic section is an ellipse
  //      if e > 1, the conic section is a hyperbola
  // width is the width of the conic section in mm (ie the outer diameter of this band of the lens)
  // only calculate half off the total width as the lens is symmetrical, so the other half can be mirrored
  // or perhaps the other half has a different e value or r value
  const halfChord = chordWidth / 2;
  const points = [];
  // Generate points for the conic section using the given radius, e, and width and starting at the
  // given y offset representing the starting point of the segment, adding the x offset to the result
  // as the centre of this segment may not be at the origin due to the previous segment
  const pointResolutionY = 0.01; // The distance between each point along the  in mm
  // calculate the points on the conic section from 0 to width using the given resolution
  for (let y = yOffset; y <= halfChord; y += pointResolutionY) {
    const x = calculateSag(radius, e, y);
    if (!isNaN(x)) {
      points.push({ x: x, y: y });
    }
  }
  return points;
}
function calculateSag(radius, e, y) {
  // Calculate the sag of an aspheric surface at the given y value (lens is upright, so for a given y value, calculate x)
  // the true x, y coordinates have offsets added to them elsewhere
  // radius is the apical radius of the conic section in mm
  // e is the conic constant, a non-negative real number
  // y is the distance from the optical axis in mm, so half chord length
  // https://en.wikipedia.org/wiki/Aspheric_lens
  // https://en.wikipedia.org/wiki/Conic_constant

  // check for invalid values
  if (radius === 0) {
    return NaN;
  }

  const k = -1 * e * e;
  const sqrtExpression = 1 - ((1 + k) * y * y) / (radius * radius);
  if (sqrtExpression < 0) {
    return NaN;
  }

  const x = (y * y) / (radius * (1 + Math.sqrt(sqrtExpression)));

  return x;
}
function calculateTangentSag(tangentAngle, width) {
  // Calculate the sag of a tangent line at the given angle and width
  // tangentAngle is the angle of the tangent line in degrees
  // width is the width of the tangent line in mm

  // check for invalid values
  if (tangentAngle === 0) {
    return NaN;
  }
  if (width <= 0) {
    return 0;
  }
  if (tangentAngle >= 90) {
    return 0;
  }
  // find the x value at the edge of T1
  return width / Math.tan(tangentAngle * (Math.PI / 180));
}

function generateKATTLensPoints(
  backOpticRadius,
  e,
  lensDiameter,
  T1,
  T2,
  SLZ,
  includeYReferenceLines = true,
) {
  // backOpticRadius is the back optic radius of the lens in mm
  // Back optic zone diameter is always 10mm
  // e is the conic constant, a non-negative real number
  // lensDiameter is the diameter of the lens in mm
  // T1 is the tangent angle that extends from the edge of the back optic radius
  //     T1 is 1mm wide at 16.5mm lens diameter, plus 1/4 of the difference between the lens diameter and 16.5mm
  // T2 is the tangent angle that extends from the edge of T1 to the SLZ
  //     T2 is 0.75mm wide at 16.5mm lens diameter, plus 1/4 of the difference between the lens diameter and 16.5mm
  // SLZ is the scleral landing zone, which is 1.5mm wide. Valid values are integers between 0 and 5 inclusive
  // the sag of the lens is defined as the sag at half way along the SLZ
  const bozDiameter = 10;
  const t1Width = 1 + (lensDiameter - 16.5) / 4;
  const t2Width = 0.75 + (lensDiameter - 16.5) / 4;
  const points = [];
  const referenceLinesY = { refPoints: [], refLabels: [] };
  const referenceLinesX = { refPoints: [], refLabels: [] };

  const pointResolutionY = 0.01; // The distance between each point along the  in mm
  if (T1 <= 20) {
    T1 = 20;
  }
  if (T2 <= 0) {
    T2 = 20;
  }
  if (T1 >= 80) {
    T1 = 80;
  }
  if (T2 >= 80) {
    T2 = 80;
  }

  // calculate the points on the conic section from 0 to half bozd width using the given resolution
  for (let y = 0; y <= bozDiameter / 2; y += pointResolutionY) {
    const x = calculateSag(backOpticRadius, e, y);
    if (!isNaN(x)) {
      points.push({ x: x, y: y });
    }
  }

  // find the x value at the edge of the BOZ
  const bozEdgeX = calculateSag(backOpticRadius, e, bozDiameter / 2);
  points.push({ x: bozEdgeX, y: bozDiameter / 2 });
  console.log(`bozEdgeX ${bozEdgeX}`);

  // find the x value at the edge of T1
  const t1EdgeX = t1Width / Math.tan(T1 * (Math.PI / 180));

  // put a point 20% into the T1
  points.push({
    x: t1EdgeX * 0.2 + bozEdgeX,
    y: bozDiameter / 2 + t1Width * 0.2,
  });

  // put a point in the middle of T1
  points.push({ x: t1EdgeX / 2 + bozEdgeX, y: bozDiameter / 2 + t1Width / 2 });

  // put a point at the edge of T1
  points.push({ x: t1EdgeX + bozEdgeX, y: bozDiameter / 2 + t1Width });
  console.log(`t1EdgeX ${t1EdgeX}`);

  // find the x value at a fraction of T2
  let T2Fraction = 0.2;
  let t2MiddleX = (t2Width / Math.tan(T2 * (Math.PI / 180))) * T2Fraction;

  // put a point in T2
  points.push({
    x: t2MiddleX + t1EdgeX + bozEdgeX,
    y: bozDiameter / 2 + t1Width + t2Width * T2Fraction,
  });
  T2Fraction = 0.6;
  t2MiddleX = (t2Width / Math.tan(T2 * (Math.PI / 180))) * T2Fraction;
  points.push({
    x: t2MiddleX + t1EdgeX + bozEdgeX,
    y: bozDiameter / 2 + t1Width + t2Width * T2Fraction,
  });

  T2Fraction = 0.95;
  t2MiddleX = (t2Width / Math.tan(T2 * (Math.PI / 180))) * T2Fraction;
  points.push({
    x: t2MiddleX + t1EdgeX + bozEdgeX,
    y: bozDiameter / 2 + t1Width + t2Width * T2Fraction,
  });
  console.log(`t2MiddleX ${t2MiddleX}`);

  // find the x value in the middle of the SLZ
  const slzMiddleY = (lensDiameter - 1.5) / 2;
  SLZ = Math.ceil(SLZ);
  let slzMiddleX = 0;
  switch (SLZ) {
    case 0:
      slzMiddleX = 0.769;
      break;
    case 1:
      slzMiddleX = 0.722;
      break;
    case 2:
      slzMiddleX = 0.699;
      break;
    case 3:
      slzMiddleX = 0.677;
      break;
    case 4:
      slzMiddleX = 0.635;
      break;
    case 5:
      slzMiddleX = 0.614;
      break;
    default:
      return points;
  }

  points.push({
    x: bozEdgeX + t1EdgeX + t2MiddleX / T2Fraction + slzMiddleX,
    y: slzMiddleY,
  });
  // now finally the final point at the edge of the lens
  const fudgedSlzEdgeMultiplier = 1.5;
  points.push({
    x:
      bozEdgeX +
      t1EdgeX +
      t2MiddleX / T2Fraction +
      slzMiddleX * fudgedSlzEdgeMultiplier,
    y: lensDiameter / 2,
  });
  const totalSagAtReferencePoint =
    bozEdgeX + t1EdgeX + t2MiddleX / T2Fraction + slzMiddleX;
  console.log(`totalSag ${totalSagAtReferencePoint}`);

  // we want the reference point for the lens to be the middle of the SLZ, so add the sag at the middle of the SLZ to the x values
  // for each point
  for (let i = 0; i < points.length; i++) {
    points[i].x -= totalSagAtReferencePoint;
  }

  // define the reference lines for the lens
  //referenceLinesX.refPoints.push( 0- totalSagAtReferencePoint)

  referenceLinesY.refPoints.push(bozDiameter / 2);
  referenceLinesX.refPoints.push(bozEdgeX - totalSagAtReferencePoint);
  referenceLinesX.refLabels.push(Math.round(bozEdgeX * 1000));

  referenceLinesY.refPoints.push(bozDiameter / 2 + t1Width);
  referenceLinesX.refPoints.push(t1EdgeX + bozEdgeX - totalSagAtReferencePoint);
  referenceLinesX.refLabels.push(Math.round((t1EdgeX + bozEdgeX) * 1000));

  referenceLinesY.refPoints.push(bozDiameter / 2 + t1Width + t2Width);
  referenceLinesX.refPoints.push(
    t2MiddleX / T2Fraction + t1EdgeX + bozEdgeX - totalSagAtReferencePoint,
  );
  referenceLinesX.refLabels.push(
    Math.round((t2MiddleX / T2Fraction + t1EdgeX + bozEdgeX) * 1000),
  );

  referenceLinesY.refPoints.push((lensDiameter - 1.5) / 2);
  referenceLinesX.refPoints.push(
    slzMiddleX +
      t2MiddleX / T2Fraction +
      t1EdgeX +
      bozEdgeX -
      totalSagAtReferencePoint,
  );
  referenceLinesX.refLabels.push(
    Math.round(
      (slzMiddleX + t2MiddleX / T2Fraction + t1EdgeX + bozEdgeX) * 1000,
    ),
  );

  referenceLinesY.refPoints.push(lensDiameter / 2);
  console.log(referenceLinesX);
  if (!includeYReferenceLines) {
    referenceLinesY.refPoints = [];
    referenceLinesY.refLabels = [];
  }
  return {
    points: points,
    referenceLinesY: referenceLinesY,
    referenceLinesX: referenceLinesX,
  };
}

export {
  generateLensPoints,
  calculateSag,
  generateKATTLensPoints,
  calculateTangentSag,
};

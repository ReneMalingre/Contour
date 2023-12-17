import { calculateSag, calculateTangentSag } from '../../utils/lensDesigns';

class KattLens {
  // private properties
  // band widths
  #t1BandWidth;
  #t2BandWidth;
  #sLZBandWidth;
  #backOpticZoneDiameter;
  #landingReferencePoint;
  #haveCalculatedBandWidths;

  // sag of bands
  #sagBackOpticZone;
  #sagT1;
  #sagT2;
  #sagSLZ; // to reference point only, not edge of lens
  // total sag
  #sagTotalAtReferencePoint;

  #haveCalculatedBandSags;

  constructor(baseCurve, eValue, t1, t2, slz, lensDiameter) {
    // initialise properties based on input parameters
    this.baseCurve = baseCurve;
    this.eValue = eValue;
    this.t1 = t1;
    this.t2 = t2;
    this.slz = slz;
    this.lensDiameter = lensDiameter;
    // public properties
    this.color = '#ffff00#'; // default to yellow
    this.drawBandLabels = false; // draw labels for the lens bands
    this.drawSagLabels = true; // draw labels for the sagitta
    this.points = []; // the points that make up the lens
    this.referenceLinesSags = []; // the y values and positions and colours for the sag reference lines
    this.referenceLinesBands = []; // the x values and positions and colours for the band reference lines

    this.#haveCalculatedBandWidths = false;
    this.#haveCalculatedBandSags = false;
  }

  calculateT1BandWidth() {
    return 1 + (this.lensDiameter - 16.5) / 4;
  }
  calculateT2BandWidth() {
    return 0.75 + (this.lensDiameter - 16.5) / 4;
  }

  lookupKattSLZReferenceSag() {
    // look up the sag of the middle of the SLZ from the table
    const SLZ = Math.ceil(this.slz);

    switch (SLZ) {
      case 0:
        return 0.769;
      case 1:
        return 0.722;
      case 2:
        return 0.699;
      case 3:
        return 0.677;
      case 4:
        return 0.635;
      case 5:
        return 0.614;
      default:
        return 0.769;
    }
  }
  initialiseStandardData() {
    if (!this.#haveCalculatedBandWidths === true) {
      // initialise private variables with calculated and standard values
      this.#t1BandWidth = this.calculateT1BandWidth();
      this.#t2BandWidth = this.calculateT2BandWidth();
      this.#sLZBandWidth = 0.75;
      this.#backOpticZoneDiameter = 10;
      this.#landingReferencePoint = this.lensDiameter - 1.5;
      this.#haveCalculatedBandWidths = true;
    }

    if (!this.#haveCalculatedBandSags === true) {
      // calculate the sag of the bands
      this.#sagBackOpticZone = calculateSag(
        this.baseCurve,
        this.eValue,
        this.#backOpticZoneDiameter / 2,
      );
      this.#sagT1 = calculateTangentSag(this.t1, this.#t1BandWidth);
      this.#sagT2 = calculateTangentSag(this.t2, this.#t2BandWidth);
      this.#sagSLZ = this.lookupKattSLZReferenceSag();
      this.#sagTotalAtReferencePoint =
        this.#sagBackOpticZone + this.#sagT1 + this.#sagT2 + this.#sagSLZ;
      this.#haveCalculatedBandSags = true;
    }
  }

  calculateSagAtY(y) {
    // calculate the sag of the lens at a given y distance out from centre (half chord length)
    // this is the distance from the chord to the curve
    this.initialiseStandardData();

    if (y <= 0) {
      // negative y values are not valid
      return 0;
    }

    if (y <= this.#backOpticZoneDiameter / 2) {
      // y is in the back optic zone
      return calculateSag(this.baseCurve, this.eValue, y);
    }
    if (y <= this.#backOpticZoneDiameter / 2 + this.#t1BandWidth) {
      // y is in the T1 band
      return (
        this.#sagBackOpticZone +
        calculateTangentSag(this.t1, y - this.#backOpticZoneDiameter / 2)
      );
    }
    if (
      y <=
      this.#backOpticZoneDiameter / 2 + this.#t1BandWidth + this.#t2BandWidth
    ) {
      // y is in the T2 band
      return (
        this.#sagBackOpticZone +
        this.#sagT1 +
        calculateTangentSag(
          this.t2,
          y - this.#backOpticZoneDiameter / 2 - this.#t1BandWidth,
        )
      );
    }
    if (y <= this.lensDiameter) {
      // y is in the SLZ
      //calculate how far into the SLZ this y value is
      const yIntoSLZ =
        y -
        this.#backOpticZoneDiameter / 2 -
        this.#t1BandWidth -
        this.#t2BandWidth;
      // calculate the sag of the SLZ at this y value
      const sagIntoSLZ = this.guesstimateSLZPointSag(yIntoSLZ);
      // return the sum of the sag of the back optic zone, T1, T2 and SLZ
      return this.#sagBackOpticZone + this.#sagT1 + this.#sagT2 + sagIntoSLZ;
    }
    // y is outside the lens, so return 0
    return 0;
  }
  guesstimateSLZPointSag(y) {
    // can only guess the true shape of the SLZ, so this is a guesstimate
    // make it a quadratic that is rotated from the beginning of the zone
    // x = ay^2

    const a = 0.6;

    // calculate the depth of the parabola at the reference point
    const sagAtReferencePoint = a * this.#sLZBandWidth * this.#sLZBandWidth;

    // calculate the remaining depth to cover to reach the reference point
    const remainingDepth = this.#sagSLZ - sagAtReferencePoint;

    // calculate the angle of rotation of the parabola
    const angle = Math.atan(remainingDepth / this.#sLZBandWidth);

    // calculate the sag at the given Y value due to the rotation
    const sagRotation = y * Math.tan(angle);

    // calculate the sag at the given Y value due to the parabola
    const sagParabola =
      a * (y - this.#sLZBandWidth) * (y - this.#sLZBandWidth) -
      sagAtReferencePoint;

    // return the sum of the two
    return sagRotation - sagParabola;
  }

  // Method to calculate points
  calculatePoints() {
    // calculate the points that make up the lens
    this.initialiseStandardData();

    // calculate the points that make up the lens
    const pointResolution = 0.05;
    const pointCloud = [];
    for (let y = 0; y <= this.lensDiameter; y += pointResolution) {
      const x = this.calculateSagAtY(y);
      pointCloud.push({ x, y });
    }
    this.points = pointCloud;
  }
}

export default KattLens;

import { calculateSag, calculateTangentSag } from '../../utils/lensDesigns';

class KattLens {
  // private properties
  // lens parameters
  #baseCurve;
  #eValue;
  #t1;
  #t2;
  #slz;
  #lensDiameter;

  // band widths
  #t1BandWidth;
  #t2BandWidth;
  #sLZBandWidth;
  #backOpticZoneDiameter;
  #landingReferencePoint;

  // calculated sag of bands
  #sagBackOpticZone;
  #sagT1;
  #sagT2;
  #sagSLZ; // to reference point only, not edge of lens

  // total sag at the reference point
  #sagTotalAtReferencePoint;

  // distance between points in mm
  #pointResolution;

  // calculated array of points
  #points;

  // precalculation flags
  #haveCalculatedBandWidths;
  #haveCalculatedBandSags;
  #haveCalculatedPoints;

  // identifier for localStorage
  #localStorageIdentifier;

  constructor(
    baseCurve,
    eValue,
    t1,
    t2,
    slz,
    lensDiameter,
    lensKey,
    load = false,
  ) {
    // initialise properties based on input parameters
    // do some validation of the input parameters
    if (baseCurve < 4 || baseCurve > 15) {
      baseCurve = 7.7;
    }
    if (eValue < 0 || eValue > 2) {
      eValue = 0.98;
    }
    if (t1 < 20 || t1 > 80) {
      t1 = 50;
    }
    if (t2 < 20 || t2 > 80) {
      t2 = 45;
    }
    // ensure that the slz is an integer
    slz = parseInt(slz);
    if (slz < 0 || slz > 5) {
      slz = 0;
    }
    // ensure that the lens diameter is a multiple of 0.5
    lensDiameter = Math.round(lensDiameter * 2) / 2;
    // check for valid values
    if (lensDiameter < 16.5 || lensDiameter > 18.5) {
      lensDiameter = 16.5;
    }

    this.#baseCurve = baseCurve;
    this.#eValue = eValue;
    this.#t1 = t1;
    this.#t2 = t2;
    this.#slz = slz;
    this.#lensDiameter = lensDiameter;
    this.#localStorageIdentifier = lensKey;

    // public properties
    if (lensKey === 'lens1') {
      this.color = '#007bff';
    } else if (lensKey === 'lens2') {
      this.color = '#ff6b6b';
    } else {
      this.color = '#ffff00'; // default to yellow
    }
    this.drawBandLabels = false; // draw labels for the lens bands
    this.drawSagLabels = true; // draw labels for the sagitta

    this.#haveCalculatedBandWidths = false;
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;

    this.#pointResolution = 0.05;

    // Load saved data from localStorage if available
    if (load) {
      this.loadFromLocalStorage();
    }
  }
  saveToLocalStorage() {
    const data = {
      baseCurve: this.#baseCurve,
      asphericity: this.#eValue,
      t1: this.#t1,
      t2: this.#t2,
      slz: this.#slz,
      lensDiameter: this.#lensDiameter,
      // ... other properties
    };
    const localStorageIdentifier = this.#localStorageIdentifier || 'default';
    localStorage.setItem(
      'kattLensData' + localStorageIdentifier,
      JSON.stringify(data),
    );
  }

  loadFromLocalStorage() {
    const localStorageIdentifier = this.#localStorageIdentifier || 'default';
    const savedData = localStorage.getItem(
      'kattLensData' + localStorageIdentifier,
    );
    if (savedData) {
      const data = JSON.parse(savedData);

      // Explicitly set each private field if data exists
      if (data.baseCurve !== undefined) {
        this.#baseCurve = data.baseCurve;
      } else {
        this.#baseCurve = 7.7;
      }

      if (data.asphericity !== undefined) {
        this.#eValue = data.asphericity;
      } else {
        this.#eValue = 0.98;
      }
      if (data.t1 !== undefined) {
        this.#t1 = data.t1;
      } else {
        this.#t1 = 50;
      }
      if (data.t2 !== undefined) {
        this.#t2 = data.t2;
      } else {
        this.#t2 = 45;
      }
      if (data.slz !== undefined) {
        this.#slz = data.slz;
      } else {
        this.#slz = 0;
      }
      if (data.lensDiameter !== undefined) {
        this.#lensDiameter = data.lensDiameter;
      } else {
        this.#lensDiameter = 16.5;
      }

      // Repeat the above pattern for other private fields if any
    }
  }

  // getters
  get baseCurve() {
    return this.#baseCurve;
  }
  get eValue() {
    return this.#eValue;
  }
  get t1() {
    return this.#t1;
  }
  get t2() {
    return this.#t2;
  }
  get slz() {
    return this.#slz;
  }
  get lensDiameter() {
    return this.#lensDiameter;
  }
  get sagTotalAtReferencePoint() {
    return this.#sagTotalAtReferencePoint;
  }
  get sagBackOpticZone() {
    this.initialiseStandardData();
    return this.#sagBackOpticZone;
  }
  get sagT1() {
    this.initialiseStandardData();
    return this.#sagT1;
  }
  get sagT2() {
    this.initialiseStandardData();
    return this.#sagT2;
  }
  get sagSLZ() {
    this.initialiseStandardData();
    return this.#sagSLZ;
  }
  // these 4 return in microns
  get sagIncludingBackOpticZone() {
    this.initialiseStandardData();
    // check for valid values
    if (this.#sagBackOpticZone === undefined) {
      return 'invalid';
    }
    return Number(this.#sagBackOpticZone * 1000).toFixed(0);
  }
  get sagIncludingT1() {
    this.initialiseStandardData();
    // check for valid values
    if (this.#sagBackOpticZone === undefined) {
      return 'invalid';
    }
    if (this.#sagT1 === undefined) {
      return 'invalid';
    }
    return Number((this.#sagBackOpticZone + this.#sagT1) * 1000).toFixed(0);
  }
  get sagIncludingT2() {
    this.initialiseStandardData();
    // check for valid values
    if (this.#sagBackOpticZone === undefined) {
      return 'invalid';
    }
    if (this.#sagT1 === undefined) {
      return 'invalid';
    }
    if (this.#sagT2 === undefined) {
      return 'invalid';
    }
    return Number(
      (this.#sagBackOpticZone + this.#sagT1 + this.#sagT2) * 1000,
    ).toFixed(0);
  }
  get sagIncludingSLZ() {
    this.initialiseStandardData();
    // check for valid values
    if (this.#sagBackOpticZone === undefined) {
      return 'invalid';
    }
    if (this.#sagT1 === undefined) {
      return 'invalid';
    }
    if (this.#sagT2 === undefined) {
      return 'invalid';
    }
    if (this.#sagSLZ === undefined) {
      return 'invalid';
    }
    return Number(
      (this.#sagBackOpticZone + this.#sagT1 + this.#sagT2 + this.#sagSLZ) *
        1000,
    ).toFixed(0);
  }

  get t1BandWidth() {
    return this.#t1BandWidth;
  }
  get t2BandWidth() {
    return this.#t2BandWidth;
  }
  get sLZBandWidth() {
    return this.#sLZBandWidth;
  }
  get backOpticZoneDiameter() {
    return this.#backOpticZoneDiameter;
  }
  get landingReferencePoint() {
    return this.#landingReferencePoint;
  }
  get points() {
    if (!this.#haveCalculatedPoints === true) {
      this.calculatePoints();
    }
    return this.#points;
  }
  get pointResolution() {
    return this.#pointResolution;
  }
  get localStorageIdentifier() {
    return this.#localStorageIdentifier;
  }

  // setters
  set baseCurve(baseCurve) {
    // check for valid values
    if (baseCurve < 4 || baseCurve > 15) {
      baseCurve = 7.7;
    }
    this.#baseCurve = baseCurve;
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;
  }
  set eValue(eValue) {
    // check for valid values
    if (eValue < 0 || eValue > 2) {
      eValue = 0.98;
    }
    this.#eValue = eValue;
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;
  }
  set t1(t1) {
    // check for valid values
    if (t1 < 20 || t1 > 80) {
      t1 = 50;
    }
    this.#t1 = t1;
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;
  }
  set t2(t2) {
    // check for valid values
    if (t2 < 20 || t2 > 80) {
      t2 = 45;
    }
    this.#t2 = t2;
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;
  }
  set slz(slz) {
    // ensure that the slz is an integer
    this.#slz = parseInt(slz);
    // check for valid values
    if (this.#slz < 0 || this.#slz > 5) {
      this.#slz = 0;
    }
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;
  }
  set lensDiameter(lensDiameter) {
    // ensure that the lens diameter is a multiple of 0.5
    lensDiameter = Math.round(lensDiameter * 2) / 2;

    // check for valid values
    if (lensDiameter < 16.5 || lensDiameter > 18.5) {
      lensDiameter = 16.5;
    }

    this.#lensDiameter = lensDiameter;
    this.#haveCalculatedBandWidths = false;
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;
  }
  set pointResolution(pointResolution) {
    this.#pointResolution = pointResolution;
    this.#haveCalculatedPoints = false;
  }
  set localStorageIdentifier(localStorageIdentifier) {
    this.#localStorageIdentifier = localStorageIdentifier;
  }

  lensParameters() {
    return {
      baseCurve: this.#baseCurve,
      eValue: this.#eValue,
      t1: this.#t1,
      t2: this.#t2,
      slz: this.#slz,
      lensDiameter: this.#lensDiameter,
    };
  }

  lensParametersString() {
    return `${parseFloat(Number(this.#baseCurve).toFixed(4))} e${
      this.#eValue
    } ${this.#t1}\\${this.#t2} ${this.#lensDiameter} SLZ ${this.#slz}`;
  }
  lensBandSagsString() {
    this.initialiseStandardData();
    return JSON.stringify(
      {
        sagBackOpticZone: this.#sagBackOpticZone,
        sagT1: this.#sagT1,
        sagT2: this.#sagT2,
        sagSLZ: this.#sagSLZ,
        sagTotalAtReferencePoint: this.#sagTotalAtReferencePoint,
      },
      null,
      2,
    );
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

      // console.log(`back optic zone sag ${this.#sagBackOpticZone}`);
      // console.log(`t1 sag ${this.#sagT1}`);
      // console.log(`t2 sag ${this.#sagT2}`);
      // console.log(`slz sag ${this.#sagSLZ}`);
      // console.log(`total sag ${this.#sagTotalAtReferencePoint}`);

      this.#haveCalculatedBandSags = true;
    }
  }
  landingZoneAdjustmentForDiameter() {
    // calculate the adjustment to the landing zone for the lens diameter
    if (this.#lensDiameter === 16.5) {
      return 0;
    }

    // calculate the sag of a 13mm sclera at 15 mm
    const sag13mmAt15mm = calculateSag(13, 0, 7.5);

    // calculate the sag of the sclera at the the lens diameter - 1.5mm
    const sagAtDifferentLZ = calculateSag(
      13,
      0,
      this.#landingReferencePoint / 2,
    );
    // console.log(`sag adjustment ${sagAtDifferentLZ - sag13mmAt15mm}`);
    return sagAtDifferentLZ - sag13mmAt15mm;
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
      // console.log(`yIntoSLZ ${yIntoSLZ} sagIntoSLZ ${sagIntoSLZ}`);
      // if (Math.abs(y - 7.5) < 0.01) {
      //   console.log(`yIntoSLZ ${yIntoSLZ} sagIntoSLZ ${sagIntoSLZ}`);
      //   console.log(
      //     ` total sag at 15mm ${
      //       this.#sagBackOpticZone + this.#sagT1 + this.#sagT2 + sagIntoSLZ
      //     }`,
      //   );
      // }
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

    const a = 0.5;

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

  // Method to calculate x, y points that make up the lens shape
  calculatePoints() {
    // set up the standard data if it hasn't been done already
    this.initialiseStandardData();

    // calculate the points that make up the lens
    const pointCloud = [];
    for (let y = 0; y <= this.lensDiameter / 2; y += this.#pointResolution) {
      const x = this.calculateSagAtY(y);
      pointCloud.push({ x, y });
    }
    // we want the reference point for the lens to be the middle of the SLZ, so add the sag at the middle of the SLZ to the x values
    // for each point
    for (let i = 0; i < pointCloud.length; i++) {
      pointCloud[i].x -=
        this.#sagTotalAtReferencePoint -
        this.landingZoneAdjustmentForDiameter();
    }
    this.#points = pointCloud;
    this.#haveCalculatedPoints = true;

    // save the data to localStorage
    this.saveToLocalStorage();
  }
  calculateSagAtYRelativeToLandingZone(y) {
    let sagAtY = this.calculateSagAtY(y);
    let sagAtLZ =
      this.#sagTotalAtReferencePoint - this.landingZoneAdjustmentForDiameter();
    return sagAtY - sagAtLZ;
  }

  // Method to calculate the reference lines for the sagitta
  // TODO

  // Method to calculate the reference lines for the bands
  referenceLinesForBands() {
    // set up the standard data if it hasn't been done already
    this.initialiseStandardData();
    const referenceLinesY = { refPoints: [], refLabels: [] };

    referenceLinesY.refPoints.push(this.#backOpticZoneDiameter / 2);
    referenceLinesY.refLabels.push('BOZD');

    referenceLinesY.refPoints.push(
      this.#backOpticZoneDiameter / 2 + this.#t1BandWidth,
    );
    referenceLinesY.refLabels.push('T1');

    referenceLinesY.refPoints.push(
      this.#backOpticZoneDiameter / 2 + this.#t1BandWidth + this.#t2BandWidth,
    );
    referenceLinesY.refLabels.push('T2');

    referenceLinesY.refPoints.push(this.#landingReferencePoint / 2);
    referenceLinesY.refLabels.push('Ref Point');

    return referenceLinesY;
  }

  get maxX() {
    if (!this.#haveCalculatedPoints === true) {
      this.calculatePoints();
    }
    return Math.max(...this.#points.map((point) => point.x));
  }
  get minX() {
    if (!this.#haveCalculatedPoints === true) {
      this.calculatePoints();
    }
    return Math.min(...this.#points.map((point) => point.x));
  }
  get maxY() {
    if (!this.#haveCalculatedPoints === true) {
      this.calculatePoints();
    }
    return Math.max(...this.#points.map((point) => point.y));
  }
  get minY() {
    if (!this.#haveCalculatedPoints === true) {
      this.calculatePoints();
    }
    return Math.min(...this.#points.map((point) => point.y));
  }
}

export default KattLens;

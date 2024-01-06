import { calculateSag, calculateTangentSag } from '../lensDesigns';
import RGPBand from './RGPBand';
import { ToricityTypes } from '../enumerations';

class MultiCurveLens {
  // Private variables
  #bands; // array of RGPBand objects
  #lensKey; // string identifier for the lens (eg lens1, lens2)
  #toricityType; // can be spherical, toric or quadrant
  #landingReferencePoint; // distance from centre of lens to the first point of contact on the cornea
  #referenceEyeAxis; // the eye axis that the lens is designed for, in degrees. The first RGPBand will be at this angle

  // calculated dimensions
  #sagBackOpticZone;
  #lensDiameter; //calculated lens diameter based on the band widths
  #backOpticZoneDiameter; // diameter of band[0]

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

  // display variables
  #color;
  #drawBandLabels;
  #drawSagLabels;

  constructor(toricityType, bands, lensKey) {
    this.#toricityType = toricityType;
    this.#bands = bands;
    this.#lensKey = lensKey;

    this.#localStorageIdentifier = lensKey;
    this.updateDisplayColour();

    // public properties

    this.#drawBandLabels = false; // draw labels for the lens bands
    this.#drawSagLabels = true; // draw labels for the sagitta

    this.#haveCalculatedBandWidths = false;
    this.#haveCalculatedBandSags = false;
    this.#haveCalculatedPoints = false;

    this.#pointResolution = 0.05;

    // Load saved data from localStorage if available
    if (load) {
      this.loadFromLocalStorage();
    }
  }
  updateDisplayColour() {
    if (this.#lensKey === 'lens1') {
      this.#color = '#007bff';
    } else if (this.#lensKey === 'lens2') {
      this.#color = '#ff6b6b';
    } else {
      this.#color = '#ffff00'; // default to yellow
    }
  }

  saveToLocalStorage() {
    // Clear existing bands from localStorage
    this.clearLocalStorageBands();
    const data = {
      toricityType: this.#toricityType,
    };
    const localStorageIdentifier = `multiCurve-${lensKey}`;
    localStorage.setItem(localStorageIdentifier, JSON.stringify(data));
    // Save current bands to localStorage
    this.#bands.forEach((band) => band.saveToLocalStorage(this.#lensKey));
  }

  clearLocalStorageBands() {
    const lensStoragePrefix = `${this.lensKey}-rgpBandData-`;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(lensStoragePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }
  loadFromLocalStorage() {
    const localStorageIdentifier = `multiCurve-${lensKey}`;
    const savedData = localStorage.getItem(localStorageIdentifier);
    if (savedData) {
      const data = JSON.parse(savedData);

      // Explicitly set each private field if data exists
      if (data.toricityType !== undefined) {
        this.#toricityType = data.toricityType;
      } else {
        this.#toricityType = ToricityTypes.SPHERICAL;
      }
      this.#bands.forEach((band) => band.loadFromLocalStorage(this.lensKey));
    }
  }

  // getters

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

  // these 4 return in microns
  get sagIncludingBackOpticZone() {
    this.initialiseStandardData();
    // check for valid values
    if (this.#sagBackOpticZone === undefined) {
      return 'invalid';
    }
    return Number(this.#sagBackOpticZone * 1000).toFixed(0);
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

  set pointResolution(pointResolution) {
    this.#pointResolution = pointResolution;
    this.#haveCalculatedPoints = false;
  }
  set localStorageIdentifier(localStorageIdentifier) {
    this.#localStorageIdentifier = localStorageIdentifier;
  }

  lensParameters() {
    return {
      lensDiameter: this.#lensDiameter,
    };
  }

  lensParametersString() {
    return `${this.#lensDiameter}`;
  }
  //   lensBandSagsString() {
  //     this.initialiseStandardData();
  //     return JSON.stringify(
  //       {
  //         sagBackOpticZone: this.#sagBackOpticZone,
  //         sagT1: this.#sagT1,
  //         sagT2: this.#sagT2,
  //         sagTotalAtReferencePoint: this.#sagTotalAtReferencePoint,
  //       },
  //       null,
  //       2,
  //     );
  //   }

  initialiseStandardData() {
    if (!this.#haveCalculatedBandWidths === true) {
      // initialise private variables with calculated and standard values
      this.#haveCalculatedBandWidths = true;
    }

    if (!this.#haveCalculatedBandSags === true) {
      // calculate the sag of the bands
      this.#sagBackOpticZone = calculateSag(
        this.baseCurve,
        this.eValue,
        this.#backOpticZoneDiameter / 2,
      );

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

    // y is outside the lens, so return 0
    return 0;
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
    // we want the reference point for the lens to be the middle of the , so add the sag at the middle of the  to the x values
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
    referenceLinesY.refLabels.push(`BOZD ${this.#backOpticZoneDiameter}mm`);

    // referenceLinesY.refPoints.push(
    //   this.#backOpticZoneDiameter / 2 + this.#t1BandWidth,
    // );
    // referenceLinesY.refLabels.push(
    //   `T1 ${this.#backOpticZoneDiameter + this.#t1BandWidth * 2}mm`,
    // );

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

export default MultiCurveLens;

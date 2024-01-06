import { ToricityTypes } from '../enumerations';
import RGPBandMeridian from './RGPBandMeridian';

class RGPBand {
  // Private variables
  #toricityType;
  #type;
  #bandKey;
  #meridians;

  constructor(toricityType, type, bandKey) {
    this.#toricityType = toricityType;
    this.#type = type;
    this.#bandKey = bandKey;
    this.#meridians = this.initializeMeridians();
  }

  initializeMeridians() {
    const meridians = [];
    const eyeAxes = [0, 90, 180, 270];
    for (let i = 0; i < (this.#toricityType ? 4 : 1); i++) {
      meridians.push(new RGPBandMeridian(null, null, null, null, eyeAxes[i]));
    }
    return meridians;
  }

  // Getters
  get toricityType() {
    return this.#toricityType;
  }
  get type() {
    return this.#type;
  }

  get bandKey() {
    return this.#bandKey;
  }

  // Setters
  set toricityType(value) {
    this.#toricityType = value;
  }
  set type(value) {
    this.#type = value;
  }
  set bandKey(value) {
    this.#bandKey = value;
  }

  saveToLocalStorage(lensKey) {
    const data = {
      toricityType: this.#toricityType,
      type: this.#type,
      bandKey: this.#bandKey,
      meridians: this.#meridians.map((meridian) => ({
        radius: meridian.radius,
        eValue: meridian.eValue,
        angle: meridian.angle,
        width: meridian.width,
        eyeAxis: meridian.eyeAxis,
      })),
    };

    localStorage.setItem(
      `${lensKey}-rgpBandData-${this.#bandKey}`,
      JSON.stringify(data),
    );
  }
  loadFromLocalStorage(lensKey) {
    const savedData = localStorage.getItem(
      `${lensKey}-rgpBandData-${this.#bandKey}`,
    );
    if (savedData) {
      const data = JSON.parse(savedData);
      this.#toricityType = data.toricityType;
      this.#type = data.type;
      this.#bandKey = data.bandKey;
      this.#meridians = data.meridians.map(
        (meridianData) =>
          new RGPBandMeridian(
            meridianData.radius,
            meridianData.eValue,
            meridianData.angle,
            meridianData.width,
            meridianData.eyeAxis,
          ),
      );
    }
  }
}

export default RGPBand;

class CorneoScleralModel {
  constructor() {
    this.points = [];
  }

  // Method to add points
  addPoint(x, y) {
    this.points.push({ x, y });
  }
  // Method to generate spline (to be implemented)
  generateSpline() {
    // Implement spline generation logic
  }

  // Method to get height at a given distance from corneal apex
  getHeightAtDistance(distance) {
    // Implement logic to calculate height
    console.log(distance);
  }
}

export default CorneoScleralModel;

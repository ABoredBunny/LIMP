class IntensityTracker {
  constructor(windowSize) {
    this.windowSize = windowSize;
    this.previousIntensity = 0;
    this.changes = [];
  }

  updateIntensityWithInput(speed) {
    // Calculate the change in intensity
    const change = Math.abs(speed - this.previousIntensity);
    // Update the previous intensity
    this.previousIntensity = speed;
    // Add the change to the changes array
    this.changes.push(change);
    // Ensure the changes array does not exceed the window size
    if (this.changes.length > this.windowSize) {
      this.changes.shift();
    }
    // Calculate the running average of changes
    const runningAverage = this.changes.reduce((sum, val) => sum + val, 0) / this.changes.length;
    // Output the running average
    console.log(`Running Average of Changes: ${runningAverage.toFixed(2)}`);
    return runningAverage;
  }
}

module.exports = IntensityTracker;

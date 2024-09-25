class VariationCalculator {
    constructor(windowSize) {
        this.windowSize = windowSize; // Number of samples for moving average
        this.values = [];
        this.differences = [];
    }

    update(value) {
        if (this.values.length > 0) {
            const lastValue = this.values[this.values.length - 1];
            const difference = Math.abs(value - lastValue);
            this.differences.push(difference);
            if (this.differences.length > this.windowSize) {
                this.differences.shift();
            }
        }
        this.values.push(value);
        if (this.values.length > this.windowSize) {
            this.values.shift();
        }
    }

    getVariation() {
        if (this.differences.length === 0) return 0;
        const sum = this.differences.reduce((a, b) => a + b, 0);
        const averageDifference = sum / this.differences.length;
        return this.normalize(averageDifference);
    }

    normalize(value) {
        return Math.min(Math.max(value, 0), 1);
    }

    calculate(value) {
        this.update(value);
        return this.getVariation();
    }

    setWindowSize(size) {
        this.windowSize = size;
        this.values = [];
        this.differences = [];
    }
}

module.exports = VariationCalculator;

class Calculator {

    constructor(value = 0) {
        this.result = value;
    }

    reset() {
        this.result = 0;
    }

    add(x, y) {
        this.result += (x + y);
        return this.result;
    }
}

module.exports = Calculator;

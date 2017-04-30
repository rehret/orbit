class pair {
    x: number;
    y: number;

    constructor() {
        this.x = 0;
        this.y = 0;
    }

    static add(p1: pair, p2: pair) {
        let sum = new pair();
        sum.x = p1.x + p2.x;
        sum.y = p1.y + p2.y;
        return sum;
    }

    add(p: pair) {
        return pair.add(this, p);
    }
}
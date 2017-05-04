/// <reference path="./pair.ts" />
/// <reference path="../helpers/physics.ts" />

class celestial {
    parent: celestial;
    children: Array<celestial>;
    position: pair;
    velocity: pair;
    mass: number;
    radius: number;
    color: string;
    mesh: THREE.Mesh;
    dot: THREE.Points;

    constructor() {
        this.parent = null;
        this.children = new Array<celestial>();
        this.position = new pair();
        this.velocity = new pair();
        this.mass = 0;
        this.radius = 0;
    }

    update() {
        if (this.parent) {
            let d = this.getDistance(this.parent);
            let g = physics.getGravityAcceleration(this.parent.mass, d);

            let parentGravityToDistanceRatio = g / d;

            // check if object should move "up" one physics grid
            if (this.parent.parent) {
                let grandparent = this.parent.parent;
                let grandparentDistance = this.getDistance(grandparent);
                let grandparentG = physics.getGravityAcceleration(grandparent.mass, grandparentDistance);

                // decide to move up a grid if ratio G:distance is greater for grandparent
                // basically, all descendants of the star will see the star as the highest G in the system
                // so we use this ratio to find the effect of gravity on the celestial, biased towards
                // the current parent
                let grandparentGravityToDistanceRatio = grandparentG / grandparentDistance;

                if (grandparentGravityToDistanceRatio > parentGravityToDistanceRatio) {
                    this.position = this.position.add(this.parent.position);
                    this.velocity = this.velocity.add(this.parent.velocity);
                    this.parent.children.splice(this.parent.children.indexOf(this), 1);
                    this.parent = this.parent.parent;
                    this.parent.children.push(this);
                    g = grandparentG;
                    d = grandparentDistance;
                }
            }

            // check if object should move "down" one physics grid
            // parent has 1 child if `this` is the only child, so we want to see if there are others first
            if (this.parent.children.length > 1) {
                let maxGSibling = this.parent.children.filter(c => c !== this).reduce((accumulator: celestial, sibling: celestial) => {
                    let siblingDistance = this.getDistance(sibling);
                    let siblingG = physics.getGravityAcceleration(sibling.mass, siblingDistance);

                    let accumulatorDistance = this.getDistance(accumulator);
                    let accumulatorG = physics.getGravityAcceleration(accumulator.mass, accumulatorDistance);

                    if (siblingG / siblingDistance > accumulatorG / accumulatorDistance) {
                        return sibling;
                    } else {
                        return accumulator;
                    }
                });

                if (maxGSibling) {
                    let siblingDistance = this.getDistance(maxGSibling);
                    let siblingG = physics.getGravityAcceleration(maxGSibling.mass, siblingDistance);

                    if (siblingG / siblingDistance > parentGravityToDistanceRatio) {
                        this.parent.children.splice(this.parent.children.indexOf(this), 1);
                        this.parent = maxGSibling;
                        this.parent.children.push(this);
                        this.position = this.position.subtract(maxGSibling.position);
                        this.velocity = this.velocity.subtract(maxGSibling.velocity);
                        g = siblingG;
                        d = siblingDistance;
                    }
                }
            }

            // apply gravity
            let start = new THREE.Vector3(this.getWorldCoords().x, this.getWorldCoords().y, 0);
            let end = new THREE.Vector3(this.parent.getWorldCoords().x, this.parent.getWorldCoords().y, 0);
            let gVector = new THREE.Line3(start, end).delta().normalize();

            this.velocity.x += gVector.x * g;
            this.velocity.y += gVector.y * g;

            this.position = this.position.add(this.velocity);
        }
    }

    getDistance(c: celestial) {
        return celestial.getDistance(this, c);
    }

    static getDistance(c1: celestial, c2: celestial): number {
        let c1Pos = c1.getWorldCoords();
        let c2Pos = c2.getWorldCoords();
        return Math.sqrt(Math.pow(c2Pos.x - c1Pos.x, 2) + Math.pow(c2Pos.y - c1Pos.y, 2));
    }

    getWorldCoords(): pair {
        return celestial.getWorldCoords(this);
    }

    static getWorldCoords(c: celestial): pair {
        let coords = <pair> {
            x: c.position.x,
            y: c.position.y
        };

        if (c.parent) {
            let parentCoords = celestial.getWorldCoords(c.parent);
            coords.x += parentCoords.x;
            coords.y += parentCoords.y;
            return coords;
        } else {
            return coords;
        }

    }
}
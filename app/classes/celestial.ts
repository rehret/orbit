/// <reference path="./pair.ts" />
/// <reference path="../helpers/physics.ts" />

class celestial {
    parent: celestial;
    position: pair;
    velocity: pair;
    mass: number;
    radius: number;
    color: string;
    mesh: THREE.Mesh;
    dot: THREE.Points;

    constructor() {
        this.parent = null;
        this.position = new pair();
        this.velocity = new pair();
        this.mass = 0;
        this.radius = 0;
    }

    update() {
        if (this.parent !== null) {
            let d = this.getDistance(this.parent);
            let g = physics.getGravityAcceleration(this.parent.mass, d);

            let start = new THREE.Vector3(this.getWorldCoords().x, this.getWorldCoords().y, 0);
            let end = new THREE.Vector3(this.parent.getWorldCoords().x, this.parent.getWorldCoords().y, 0);
            let gVector = new THREE.Line3(start, end).delta().normalize();

            this.velocity.x += gVector.x * g;
            this.velocity.y += gVector.y * g;

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
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

        if (c.parent !== null) {
            let parentCoords = celestial.getWorldCoords(c.parent);
            coords.x += parentCoords.x;
            coords.y += parentCoords.y;
            return coords;
        } else {
            return coords;
        }

    }
}
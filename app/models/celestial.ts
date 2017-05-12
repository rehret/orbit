/// <reference path="./pair.ts" />
/// <reference path="../helpers/physics.ts" />

class celestial {
    parent: celestial;
    children: Array<celestial>;
    position: pair;
    velocity: pair;

    /**
     * Rotational velocity around the Z-axis in radians
     * Positive values are counter-clockwise, negative are clockwise
    */
    rotationalVelocity: number;
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
        this.rotationalVelocity = 0;
        this.mass = 0;
        this.radius = 0;
    }

    public update() {
        if (this.parent) {
            // check if object should move "up" one physics grid
            if (this.shouldMoveUpOneGrid()) {
                this.moveUpOneGrid();
            }

            // check if object should move "down" one physics grid
            if (this.shouldMoveDownOneGrid()) {
                this.moveDownOneGrid();
            }

            let g = physics.getGravityAcceleration(this.parent.mass, this.getDistance(this.parent));

            // apply gravity
            let start = new THREE.Vector3(this.getWorldCoords().x, this.getWorldCoords().y, 0);
            let end = new THREE.Vector3(this.parent.getWorldCoords().x, this.parent.getWorldCoords().y, 0);
            let gVector = new THREE.Line3(start, end).delta().normalize();

            this.velocity.x += gVector.x * g;
            this.velocity.y += gVector.y * g;

            this.position = this.position.add(this.velocity);

            let worldCoords = this.getWorldCoords();
            this.mesh.position.x = worldCoords.x;
            this.mesh.position.y = worldCoords.y;
            this.dot.position.x = worldCoords.x;
            this.dot.position.y = worldCoords.y;

            this.mesh.rotateZ(this.rotationalVelocity);
        }
    }

    private getGravityToDistanceRatio(c: celestial): number {
        let distance = this.getDistance(c);
        let g = physics.getGravityAcceleration(c.mass, distance);
        return g / distance;
    }

    private shouldMoveUpOneGrid(): boolean {
        if (this.parent && this.parent.parent) {
            // decide to move up a grid if ratio G:distance is greater for grandparent
            // basically, all descendants of the star will see the star as the highest G in the system
            // so we use this ratio to find the effect of gravity on the celestial, biased towards
            // the current parent
            let grandparentGravityToDistanceRatio = this.getGravityToDistanceRatio(this.parent.parent);
            let parentGravityToDistanceRatio = this.getGravityToDistanceRatio(this.parent);

            return grandparentGravityToDistanceRatio > parentGravityToDistanceRatio;
        }
    }

    private shouldMoveDownOneGrid(): boolean {
        // parent has 1 child if `this` is the only child, so we want to see if there are others first
        if (this.parent.children.length > 1) {
            let maxGSibling = this.getMaxGRatioSibling();

            if (maxGSibling && this.getGravityToDistanceRatio(maxGSibling) > this.getGravityToDistanceRatio(this.parent)) {
                return true
            }
        }
        return false;
    }

    private moveUpOneGrid() {
        this.position = this.position.add(this.parent.position);
        this.velocity = this.velocity.add(this.parent.velocity);
        this.assignNewParent(this.parent.parent);
    }

    private moveDownOneGrid() {
        let maxGSibling = this.getMaxGRatioSibling();
        this.position = this.position.subtract(maxGSibling.position);
        this.velocity = this.velocity.subtract(maxGSibling.velocity);
        this.assignNewParent(maxGSibling);
    }

    public assignNewParent(parent: celestial) {
        if (this.parent) {
            this.parent.children.splice(this.parent.children.indexOf(this), 1);
        }
        this.parent = parent;
        this.parent.children.push(this);
    }

    private getMaxGRatioSibling(): celestial {
        return this.parent.children.filter(c => c !== this).reduce((accumulator: celestial, sibling: celestial) => {
            if (this.getGravityToDistanceRatio(sibling) > this.getGravityToDistanceRatio(accumulator)) {
                return sibling;
            } else {
                return accumulator;
            }
        });
    }

    public getDistance(c: celestial) {
        return celestial.getDistance(this, c);
    }

    public static getDistance(c1: celestial, c2: celestial): number {
        let c1Pos = c1.getWorldCoords();
        let c2Pos = c2.getWorldCoords();
        return Math.sqrt(Math.pow(c2Pos.x - c1Pos.x, 2) + Math.pow(c2Pos.y - c1Pos.y, 2));
    }

    public getWorldCoords(): pair {
        return celestial.getWorldCoords(this);
    }

    public static getWorldCoords(c: celestial): pair {
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
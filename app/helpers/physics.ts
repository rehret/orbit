namespace physics {
    const G = 6.67259e-11;

    export function getGravityAcceleration(mass: number, distance: number): number {
        return (G * mass) / Math.pow(distance, 2);
    }

    export function getCircularOrbitVelocity(mass: number, distance: number): number {
        return Math.sqrt((G * mass) / distance);
    }
}
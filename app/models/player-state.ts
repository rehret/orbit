import { ship } from "./ship";
import { IPlayerState } from "../interfaces/iplayer-state";
import { physics } from "../helpers/physics";

export class PlayerState implements IPlayerState {
    PlayerObject: ship;

    private turningSpeed = 0.05;
    private thrust = 1;
    private maneuverThrust = 0.01;
    private isThrusting = false;
    private isManeuveringForward = false;
    private isManeuveringReverse = false;

    constructor() {
        this.PlayerObject = new ship();
    }

    Update(): PlayerState {
        this.PlayerObject.update();

        if (this.isThrusting) {
            let rotation = this.PlayerObject.mesh.getWorldRotation();

            // sin and cos are flipped for x and y since we're dealing with the z-axis
            let heading = new THREE.Vector2(-Math.sin(rotation.z), Math.cos(rotation.z)).normalize();

            this.PlayerObject.velocity.x += this.thrust * heading.x;
            this.PlayerObject.velocity.y += this.thrust * heading.y;
        }

        if (this.isManeuveringForward) {
            let rotation = this.PlayerObject.mesh.getWorldRotation();

            // sin and cos are flipped for x and y since we're dealing with the z-axis
            let heading = new THREE.Vector2(-Math.sin(rotation.z), Math.cos(rotation.z)).normalize();

            this.PlayerObject.velocity.x += this.maneuverThrust * heading.x;
            this.PlayerObject.velocity.y += this.maneuverThrust * heading.y;
        }

        if (this.isManeuveringReverse) {
            let rotation = this.PlayerObject.mesh.getWorldRotation();

            // sin and cos are flipped for x and y since we're dealing with the z-axis
            let heading = new THREE.Vector2(-Math.sin(rotation.z), Math.cos(rotation.z)).normalize();

            this.PlayerObject.velocity.x -= this.maneuverThrust * heading.x;
            this.PlayerObject.velocity.y -= this.maneuverThrust * heading.y;
        }

        return this;
    }

    BeginCounterClockwiseRotation(): void {
        this.PlayerObject.rotationalVelocity = this.turningSpeed;
    }

    BeginClockwiseRotation(): void {
        this.PlayerObject.rotationalVelocity = -this.turningSpeed;
    }

    EndRotation(): void {
        this.PlayerObject.rotationalVelocity = 0;
    }

    BeginMainThrust(): void {
        this.isThrusting = true;
    }

    EndMainThrust(): void {
        this.isThrusting = false;
    }

    BeginManeuveringThrustForward(): void {
        this.isManeuveringForward = true;
    }

    EndManeuveringThrustForward(): void {
        this.isManeuveringForward = false;
    }

    BeginManeuveringThrustReverse(): void {
        this.isManeuveringReverse = true;
    }

    EndManeuveringThrustReverse(): void {
        this.isManeuveringReverse = false;
    }
}
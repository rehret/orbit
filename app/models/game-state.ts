/// <reference path="../interfaces/iplayer-state.ts" />
/// <reference path="./player-state.ts" />
/// <reference path="./celestial.ts" />
/// <reference path="../helpers/keyboard.ts" />

class GameState {
    Player: IPlayerState;
    Celestials: Array<celestial>;
    CameraZ: number;

    constructor() {
        this.Player = new PlayerState();
        this.Celestials = new Array<celestial>();
        this.CameraZ = 0;
    }

    Update() {
        this.Celestials.forEach(c => c.update());
        this.Player = this.Player.Update();
        let velocity = Math.sqrt(Math.pow(this.Player.PlayerObject.velocity.x, 2) + Math.pow(this.Player.PlayerObject.velocity.y, 2));
        document.getElementById("velocity").innerText = `${velocity.toFixed(2)} m/s`;
        document.getElementById("velocity-in-c").innerText = `${(velocity / physics.C).toFixed(7)}c`;
        document.getElementById("altitude").innerText = `Altitude: ${(this.Player.PlayerObject.getDistance(this.Player.PlayerObject.parent) - this.Player.PlayerObject.parent.radius).toFixed(0)}m`;
    }

    CameraZoom(zoomAmount) {
        this.CameraZ -= this.CameraZ / (zoomAmount / 20);
        if (this.CameraZ > 1e13) {
            this.CameraZ = 1e13;
        } else if (this.CameraZ < this.Player.PlayerObject.radius * 2) {
            this.CameraZ = this.Player.PlayerObject.radius * 2;
        }
    }

    KeyDownHandler(keyCode) {
        switch (keyCode) {
            case keyboard.A:
                this.Player.BeginCounterClockwiseRotation();
                break;

            case keyboard.D:
                this.Player.BeginClockwiseRotation();
                break;

            case keyboard.SPACE:
                this.Player.BeginMainThrust();
                break;

            case keyboard.W:
                this.Player.BeginManeuveringThrustForward();
                break;

            case keyboard.S:
                this.Player.BeginManeuveringThrustReverse();
                break;
        }
    }

    KeyUpHandler(keyCode) {
        switch (keyCode) {
            case keyboard.A:
            case keyboard.D:
                this.Player.EndRotation();
                break;

            case keyboard.SPACE:
                this.Player.EndMainThrust();
                break;

            case keyboard.W:
                this.Player.EndManeuveringThrustForward();
                break;

            case keyboard.S:
                this.Player.EndManeuveringThrustReverse();
                break;
        }
    }
}
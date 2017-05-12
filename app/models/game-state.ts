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
/// <reference path="../interfaces/iplayer-state.ts" />
/// <reference path="./player-state.ts" />
/// <reference path="./celestial.ts" />

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

    CameraZoom(event) {
        this.CameraZ -= this.CameraZ / (event.wheelDelta / 20);
        if (this.CameraZ > 1e13) {
            this.CameraZ = 1e13;
        } else if (this.CameraZ < this.Player.PlayerObject.radius * 2) {
            this.CameraZ = this.Player.PlayerObject.radius * 2;
        }
    }
}
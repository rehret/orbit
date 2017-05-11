/// <reference path="./ship.ts" />
/// <reference path="../interfaces/iplayer-state.ts" />

class PlayerState implements IPlayerState {
    PlayerObject: ship;

    constructor() {
        this.PlayerObject = new ship();
    }

    Update(): PlayerState {
        this.PlayerObject.update();
        return this;
    }

}
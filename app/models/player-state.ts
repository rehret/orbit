/// <reference path="./celestial.ts" />
/// <reference path="../interfaces/iplayer-state.ts" />

class PlayerState implements IPlayerState {
    PlayerObject: celestial;

    constructor() {
        this.PlayerObject = new celestial();
    }

    Update(): PlayerState {
        this.PlayerObject.update();
        return this;
    }

}
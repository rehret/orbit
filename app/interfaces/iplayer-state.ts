/// <reference path="../models/ship.ts" />

interface IPlayerState {
    PlayerObject: ship;

    Update(): PlayerState

    BeginCounterClockwiseRotation(): void
    BeginClockwiseRotation(): void
    EndRotation(): void

    BeginMainThrust(): void
    EndMainThrust(): void

    BeginManeuveringThrustForward(): void
    EndManeuveringThrustForward(): void
    BeginManeuveringThrustReverse(): void
    EndManeuveringThrustReverse(): void
}
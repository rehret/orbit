import { ship } from "../models/ship"

export interface IPlayerState {
    PlayerObject: ship;

    Update(): IPlayerState

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
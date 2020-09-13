namespace Matchmaker
{
    export class Player
    {
        protected _callsign: string;
        protected _SR: Player.SR;
        protected _roles: Player.Roles;

        constructor(callsign: string, SR: Player.SR, roles: Player.Roles)
        {
            this._callsign = callsign;
            this._SR = SR;
            this._roles = roles;
        }
    }

    export namespace Player
    {
        export enum Role
        {
            TANK,
            DPS,
            SUP
        }

        export interface Roles
        {
            tank: boolean;
            dps: boolean;
            sup: boolean;
            preffered: Role.SUP
        }

        export interface SR
        {
            tank: number;
            dps: number;
            sup: number;
        }
    }
}
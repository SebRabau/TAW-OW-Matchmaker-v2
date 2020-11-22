namespace Matchmaker
{
    export class Player
    {
        protected readonly _callsign: string;
        protected readonly _SR: Player.SR;
        protected readonly _roles: Player.Roles;

        protected _team: Team = new Team("NO TEAM");

        public get callsign() { return this._callsign; }
        public get SR() { return this._SR; }
        public get roles() { return this._roles; }

        public get team() { return this._team; }
        public set team(value: Team) { this._team = value; }

        constructor(callsign: string, SR: Player.SR, roles: Player.Roles)
        {
            this._callsign = callsign;
            this._SR = SR;
            this._roles = roles;
        }

        public canPlay(role: Player.Role): boolean
        {
            switch (role)
            {
                case Player.Role.TANK:
                    return this._roles.tank;
                case Player.Role.DPS:
                    return this._roles.dps;
                case Player.Role.SUP:
                    return this._roles.sup;
                default:
                    return false;
            }
        }

        public getSR(role: Player.Role): number
        {
            switch (role)
            {
                case Player.Role.TANK:
                    return this._SR.tank;
                case Player.Role.DPS:
                    return this._SR.dps;
                case Player.Role.SUP:
                    return this._SR.sup;
                default:
                    return 0;
            }
        }
    }

    export namespace Player
    {
        export enum Role
        {
            TANK,
            DPS,
            SUP,
            NONE
        }

        export interface Roles
        {
            tank: boolean;
            dps: boolean;
            sup: boolean;
            preffered: Role;
            current: Role;
        }

        export interface SR
        {
            tank: number;
            dps: number;
            sup: number;
        }
    }
}
namespace Matchmaker
{
    export class Team
    {
        protected _name: string;
        protected _tankPlayers: Player[] = [];
        protected _dpsPlayers: Player[] = [];
        protected _supPlayers: Player[] = [];
        protected _allPlayers: Player[] = [];

        public get tankPlayers() { return this._tankPlayers; }
        public get dpsPlayers() { return this._dpsPlayers; }
        public get supPlayers() { return this._supPlayers; }
        public get allPlayers() { return this._allPlayers; }
        public get name() { return this._name; }

        constructor(name: string)
        {
            this._name = name;
        }

        public getID(): string
        {
            let ID = "" + this._name;
            this._allPlayers.forEach((p) => ID += p.callsign);
            return ID;
        }

        public getGaps(): Player.Role[]
        {
            const gaps = [];
            if (this._tankPlayers.length === 0) { gaps.push(Player.Role.TANK); gaps.push(Player.Role.TANK); }
            if (this._dpsPlayers.length === 0) { gaps.push(Player.Role.DPS); gaps.push(Player.Role.DPS); }
            if (this._supPlayers.length === 0) { gaps.push(Player.Role.SUP); gaps.push(Player.Role.SUP); }

            if (this._tankPlayers.length === 1) { gaps.push(Player.Role.TANK); }
            if (this._dpsPlayers.length === 1) { gaps.push(Player.Role.DPS); }
            if (this._supPlayers.length === 1) { gaps.push(Player.Role.SUP); }
            return gaps;
        }

        public getAverage(): number
        {
            let avg = 0;
            this._tankPlayers.forEach((p) => avg += p.SR.tank);
            this._dpsPlayers.forEach((p) => avg += p.SR.dps);
            this._supPlayers.forEach((p) => avg += p.SR.sup);
            return avg / this._allPlayers.length;
        }

        public setComp()
        {
            this._name += " - COMP";
        }

        public getPlayers(role: Player.Role): Player[]
        {
            switch (role)
            {
                case Player.Role.TANK:
                    return this._tankPlayers;
                case Player.Role.DPS:
                    return this._dpsPlayers;
                case Player.Role.SUP:
                    return this._supPlayers;
                default:
                    return [];
            }
        }

        public assignPlayer(player: Player, role: Player.Role)
        {
            player.team = this;
            switch(role)
            {
                case Player.Role.TANK:
                    player.roles.current = Player.Role.TANK;
                    this._tankPlayers.push(player);
                    this._allPlayers.push(player);
                    break;
                case Player.Role.DPS:
                    player.roles.current = Player.Role.DPS;
                    this._dpsPlayers.push(player);
                    this._allPlayers.push(player);
                    break;
                case Player.Role.SUP:
                    player.roles.current = Player.Role.SUP;
                    this._supPlayers.push(player);
                    this._allPlayers.push(player);
                    break;
            }
        }

        public removePlayer(player: Player, role: Player.Role)
        {
            switch (role)
            {
                case Player.Role.TANK:
                    this._tankPlayers.splice(this._tankPlayers.indexOf(player), 1);
                    this._allPlayers.splice(this._allPlayers.indexOf(player), 1);
                    break;
                case Player.Role.DPS:
                    this._dpsPlayers.splice(this._dpsPlayers.indexOf(player), 1);
                    this._allPlayers.splice(this._allPlayers.indexOf(player), 1);
                    break;
                case Player.Role.SUP:
                    this._supPlayers.splice(this._supPlayers.indexOf(player), 1);
                    this._allPlayers.splice(this._allPlayers.indexOf(player), 1);
                    break;
            }
        }

        public swapPlayer(player: Player, oldRole: Player.Role, newRole: Player.Role)
        {
            switch(oldRole)
            {
                case Player.Role.TANK:
                    this._tankPlayers.splice(this._tankPlayers.indexOf(player), 1);
                    break;
                case Player.Role.DPS:
                    this._dpsPlayers.splice(this._dpsPlayers.indexOf(player), 1);
                    break;
                case Player.Role.SUP:
                    this._supPlayers.splice(this._supPlayers.indexOf(player), 1);
                    break;
            }

            switch(newRole)
            {
                case Player.Role.TANK:
                    this._tankPlayers.push(player);
                    player.roles.current = Player.Role.TANK;
                    break;
                case Player.Role.DPS:
                    this._dpsPlayers.push(player);
                    player.roles.current = Player.Role.DPS;
                    break;
                case Player.Role.SUP:
                    this._supPlayers.push(player);
                    player.roles.current = Player.Role.SUP;
                    break;
            }
        }
    }
}
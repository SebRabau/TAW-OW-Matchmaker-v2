namespace Matchmaker
{
    export class Team
    {
        protected readonly _name: string;
        protected _tankPlayers: Player[] = [];
        protected _dpsPlayers: Player[] = [];
        protected _supPlayers: Player[] = [];
        protected _allPlayers: Player[] = [];

        public get tankPlayers() { return this._tankPlayers; }
        public get dpsPlayers() { return this._dpsPlayers; }
        public get supPlayers() { return this._supPlayers; }
        public get allPlayers() { return this._allPlayers; }

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
            if (this._tankPlayers.length === 0) { gaps.push(Player.Role.TANK) }
            if (this._dpsPlayers.length === 0) { gaps.push(Player.Role.DPS) }
            if (this._supPlayers.length === 0) { gaps.push(Player.Role.SUP) }

            if (this._tankPlayers.length === 1) { gaps.push(Player.Role.TANK) }
            if (this._dpsPlayers.length === 1) { gaps.push(Player.Role.DPS) }
            if (this._supPlayers.length === 1) { gaps.push(Player.Role.SUP) }
            return gaps;
        }

        public assignPlayer(player: Player, role: Player.Role)
        {
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

        public swapPlayer(player: Player, oldRole: Player.Role, newRole: Player.Role)
        {
            switch(oldRole)
            {
                case Player.Role.TANK:
                    this._tankPlayers = this._tankPlayers.splice(this._tankPlayers.indexOf(player), 0);
                    break;
                case Player.Role.DPS:
                    this._tankPlayers = this._dpsPlayers.splice(this._dpsPlayers.indexOf(player), 0);
                    break;
                case Player.Role.SUP:
                    this._tankPlayers = this._supPlayers.splice(this._supPlayers.indexOf(player), 0);
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
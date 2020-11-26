namespace Matchmaker
{
    export class Bench
    {
        public tankPlayers: Player[] = [];
        public dpsPlayers: Player[] = [];
        public supPlayers: Player[] = [];
        public otherPlayers: Player[] = [];

        protected _remainingPlayers: Player[] = [];

        public get remainingPlayers()
        {
            this.refreshRemainingPlayers();
            return this._remainingPlayers;
        }

        constructor() {}

        public benchPlayer(player: Player, role: Player.Role)
        {
            console.log("Benching: " + player.callsign);
            switch(role)
            {
                case Player.Role.TANK:
                    this.tankPlayers.push(player);
                    break;
                case Player.Role.DPS:
                    this.dpsPlayers.push(player);
                    break;
                case Player.Role.SUP:
                    this.supPlayers.push(player);
                    break;
                case Player.Role.NONE:
                    this.otherPlayers.push(player);
                    break;
            }
            this.refreshRemainingPlayers();
        }

        public unbench(player: Player)
        {
            console.log("Unbenching " + player.callsign);
            if (this.tankPlayers.indexOf(player) > -1)
            {
                this.tankPlayers.splice(this.tankPlayers.indexOf(player), 1);
            }
            if (this.dpsPlayers.indexOf(player) > -1)
            {
                this.dpsPlayers.splice(this.dpsPlayers.indexOf(player), 1);
            }
            if (this.supPlayers.indexOf(player) > -1)
            {
                this.supPlayers.splice(this.supPlayers.indexOf(player), 1);
            }
            if (this.otherPlayers.indexOf(player) > -1)
            {
                this.otherPlayers.splice(this.otherPlayers.indexOf(player), 1);
            }
            this.refreshRemainingPlayers();
        }

        protected refreshRemainingPlayers()
        {
            this._remainingPlayers = [];
            this._remainingPlayers = this._remainingPlayers.concat(
                this.dpsPlayers,
                this.tankPlayers,
                this.supPlayers,
                this.otherPlayers
            );

            let players = "Players in bench: ";
            this._remainingPlayers.forEach((p, i) => players += p.callsign + (i === this._remainingPlayers.length - 1 ? "" : "; "));
            console.log(players);
        }
    }
}
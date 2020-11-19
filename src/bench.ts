namespace Matchmaker
{
    export class Bench
    {
        public tankPlayers: Player[] = [];
        public dpsPlayers: Player[] = [];
        public supPlayers: Player[] = [];
        public otherPlayers: Player[] = [];
        public remainingPlayers: Player[] = [];

        constructor() {}

        public benchPlayer(player: Player, role: Player.Role)
        {
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
        }

        public unbench(player: Player)
        {
            if (this.tankPlayers.indexOf(player) > -1)
            {
                this.tankPlayers = this.tankPlayers.splice(this.tankPlayers.indexOf(player), 0);
            }
            if (this.dpsPlayers.indexOf(player) > -1)
            {
                this.dpsPlayers = this.dpsPlayers.splice(this.dpsPlayers.indexOf(player), 0);
            }
            if (this.supPlayers.indexOf(player) > -1)
            {
                this.supPlayers = this.supPlayers.splice(this.supPlayers.indexOf(player), 0);
            }
            if (this.otherPlayers.indexOf(player) > -1)
            {
                this.otherPlayers = this.otherPlayers.splice(this.otherPlayers.indexOf(player), 0);
            }
        }

        public refreshRemainingPlayers()
        {
            this.remainingPlayers = [];
            this.remainingPlayers = this.remainingPlayers.concat(
                this.dpsPlayers,
                this.tankPlayers,
                this.supPlayers,
                this.otherPlayers
            );
        }
    }
}
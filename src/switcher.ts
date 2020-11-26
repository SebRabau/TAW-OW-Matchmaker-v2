namespace Matchmaker
{
    export class Switcher
    {
        protected _SRChange: number = 0;
        protected _switchPossible: boolean = false;

        public get SRChange() { return this._SRChange; }
        public get switchPossible() { return this._switchPossible; }

        constructor(protected team1: Team, protected role1: Player.Role, protected player1: Player, protected team2: Team, protected role2: Player.Role, protected player2: Player)
        {
            this.calcSRDiff();
            this.calcSwitchPossible();
        }

        public getID(): string
        {
            let ID = "";
            const players = [ this.player1.callsign, this.player2.callsign ];
            players.sort();
            players.forEach((c) => ID += c);

            ID += this.role1;
            ID += this.role2;

            return ID;
        }

        public makeSwitch()
        {
            console.log("Switching " + this.player1.callsign + " off " + this.team1.name + " for " + this.player2.callsign + " on " + this.team2.name);

            this.team1.removePlayer(this.player1, this.role1);
            this.team2.removePlayer(this.player2, this.role2);

            this.team1.assignPlayer(this.player2, this.role1);
            this.team2.assignPlayer(this.player1, this.role2);
        }

        protected calcSRDiff()
        {
            const oldTeam1SR = this.team1.getAverage() * this.team1.allPlayers.length;
            const oldTeam2SR = this.team2.getAverage() * this.team2.allPlayers.length;

            const team1WithoutPlayer = oldTeam1SR - this.player1.getSR(this.role1);
            const team2WithoutPlayer = oldTeam2SR - this.player2.getSR(this.role2);

            const team1AfterSwitch = team1WithoutPlayer + this.player2.getSR(this.role1);
            const team2AfterSwitch = team2WithoutPlayer + this.player1.getSR(this.role2);

            const newTeam1 = team1AfterSwitch / this.team1.allPlayers.length;
            const newTeam2 = team2AfterSwitch / this.team2.allPlayers.length;

            this._SRChange = newTeam1 - newTeam2;
        }

        protected calcSwitchPossible()
        {
            this._switchPossible = this.player1.canPlay(this.role2) && this.player2.canPlay(this.role1);
        }
    }
}
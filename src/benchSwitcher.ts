namespace Matchmaker
{
    export class BenchSwitcher
    {
        protected _SRChange: number = 0;
        protected _switchPossible: boolean = false;

        public get SRChange() { return this._SRChange; }
        public get switchPossible() { return this._switchPossible; }

        constructor(protected team: Team, protected role: Player.Role, protected player: Player, protected bench: Bench, protected bench_Player: Player)
        {
            this.calcSRDiff();
            this.calcSwitchPossible();
        }

        public getID(): string
        {
            let ID = "";
            const players = [ this.player.callsign, this.bench_Player.callsign ];
            players.sort();
            players.forEach((c) => ID += c);

            ID += this.role;

            return ID;
        }

        public makeSwitch()
        {
            this.team.removePlayer(this.player, this.role);
            this.bench.unbench(this.bench_Player);

            this.team.assignPlayer(this.bench_Player, this.role);
            this.bench.benchPlayer(this.player, this.player.roles.preffered);
        }

        protected calcSRDiff()
        {
            const p1SR = this.player.getSR(this.role);
            const p2SR = this.bench_Player.getSR(this.role);

            const diff = p2SR - p1SR;
            this._SRChange = diff / 6;
        }

        protected calcSwitchPossible()
        {
            this._switchPossible = this.bench_Player.canPlay(this.role);
        }
    }
}
"use strict";
var Matchmaker;
(function (Matchmaker) {
    var BenchSwitcher = /** @class */ (function () {
        function BenchSwitcher(team, role, player, bench, bench_Player) {
            this.team = team;
            this.role = role;
            this.player = player;
            this.bench = bench;
            this.bench_Player = bench_Player;
            this._SRChange = 0;
            this._switchPossible = false;
            this.calcSRDiff();
            this.calcSwitchPossible();
        }
        Object.defineProperty(BenchSwitcher.prototype, "SRChange", {
            get: function () { return this._SRChange; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BenchSwitcher.prototype, "switchPossible", {
            get: function () { return this._switchPossible; },
            enumerable: false,
            configurable: true
        });
        BenchSwitcher.prototype.getID = function () {
            var ID = "";
            var players = [this.player.callsign, this.bench_Player.callsign];
            players.sort();
            players.forEach(function (c) { return ID += c; });
            ID += this.role;
            return ID;
        };
        BenchSwitcher.prototype.makeSwitch = function () {
            this.team.removePlayer(this.player, this.role);
            this.bench.unbench(this.bench_Player);
            this.team.assignPlayer(this.bench_Player, this.role);
            this.bench.benchPlayer(this.player, this.player.roles.preffered);
        };
        BenchSwitcher.prototype.calcSRDiff = function () {
            var oldTeamSR = this.team.getAverage() * this.team.allPlayers.length;
            var teamWithoutPlayer = oldTeamSR - this.player.getSR(this.role);
            var teamAfterSwitch = teamWithoutPlayer + this.bench_Player.getSR(this.role);
            var newTeam = (teamAfterSwitch - oldTeamSR) / this.team.allPlayers.length;
            this._SRChange = Math.abs(oldTeamSR - newTeam);
        };
        BenchSwitcher.prototype.calcSwitchPossible = function () {
            this._switchPossible = this.bench_Player.canPlay(this.role);
        };
        return BenchSwitcher;
    }());
    Matchmaker.BenchSwitcher = BenchSwitcher;
})(Matchmaker || (Matchmaker = {}));

"use strict";
var Matchmaker;
(function (Matchmaker) {
    var Switcher = /** @class */ (function () {
        function Switcher(team1, role1, player1, team2, role2, player2) {
            this.team1 = team1;
            this.role1 = role1;
            this.player1 = player1;
            this.team2 = team2;
            this.role2 = role2;
            this.player2 = player2;
            this._SRChange = 0;
            this._switchPossible = false;
            this.calcSRDiff();
            this.calcSwitchPossible();
        }
        Object.defineProperty(Switcher.prototype, "SRChange", {
            get: function () { return this._SRChange; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Switcher.prototype, "switchPossible", {
            get: function () { return this._switchPossible; },
            enumerable: false,
            configurable: true
        });
        Switcher.prototype.getID = function () {
            var ID = "";
            var players = [this.player1.callsign, this.player2.callsign];
            players.sort();
            players.forEach(function (c) { return ID += c; });
            ID += this.role1;
            ID += this.role2;
            return ID;
        };
        Switcher.prototype.makeSwitch = function () {
            this.team1.removePlayer(this.player1, this.role1);
            this.team2.removePlayer(this.player2, this.role2);
            this.team1.assignPlayer(this.player2, this.role1);
            this.team2.assignPlayer(this.player1, this.role2);
        };
        Switcher.prototype.calcSRDiff = function () {
            var oldTeam1SR = this.team1.getAverage() * this.team1.allPlayers.length;
            var oldTeam2SR = this.team2.getAverage() * this.team2.allPlayers.length;
            var team1WithoutPlayer = oldTeam1SR - this.player1.getSR(this.role1);
            var team2WithoutPlayer = oldTeam2SR - this.player2.getSR(this.role2);
            var team1AfterSwitch = team1WithoutPlayer + this.player2.getSR(this.role1);
            var team2AfterSwitch = team2WithoutPlayer + this.player1.getSR(this.role2);
            var newTeam1 = team1AfterSwitch / this.team1.allPlayers.length;
            var newTeam2 = team2AfterSwitch / this.team2.allPlayers.length;
            this._SRChange = newTeam1 - newTeam2;
        };
        Switcher.prototype.calcSwitchPossible = function () {
            this._switchPossible = this.player1.canPlay(this.role2) && this.player2.canPlay(this.role1);
        };
        return Switcher;
    }());
    Matchmaker.Switcher = Switcher;
})(Matchmaker || (Matchmaker = {}));

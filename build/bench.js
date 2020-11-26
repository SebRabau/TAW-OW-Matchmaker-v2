"use strict";
var Matchmaker;
(function (Matchmaker) {
    var Bench = /** @class */ (function () {
        function Bench() {
            this.tankPlayers = [];
            this.dpsPlayers = [];
            this.supPlayers = [];
            this.otherPlayers = [];
            this._remainingPlayers = [];
        }
        Object.defineProperty(Bench.prototype, "remainingPlayers", {
            get: function () {
                this.refreshRemainingPlayers();
                return this._remainingPlayers;
            },
            enumerable: false,
            configurable: true
        });
        Bench.prototype.benchPlayer = function (player, role) {
            console.log("Benching: " + player.callsign);
            switch (role) {
                case Matchmaker.Player.Role.TANK:
                    this.tankPlayers.push(player);
                    break;
                case Matchmaker.Player.Role.DPS:
                    this.dpsPlayers.push(player);
                    break;
                case Matchmaker.Player.Role.SUP:
                    this.supPlayers.push(player);
                    break;
                case Matchmaker.Player.Role.NONE:
                    this.otherPlayers.push(player);
                    break;
            }
            this.refreshRemainingPlayers();
        };
        Bench.prototype.unbench = function (player) {
            console.log("Unbenching " + player.callsign);
            if (this.tankPlayers.indexOf(player) > -1) {
                this.tankPlayers.splice(this.tankPlayers.indexOf(player), 1);
            }
            if (this.dpsPlayers.indexOf(player) > -1) {
                this.dpsPlayers.splice(this.dpsPlayers.indexOf(player), 1);
            }
            if (this.supPlayers.indexOf(player) > -1) {
                this.supPlayers.splice(this.supPlayers.indexOf(player), 1);
            }
            if (this.otherPlayers.indexOf(player) > -1) {
                this.otherPlayers.splice(this.otherPlayers.indexOf(player), 1);
            }
            this.refreshRemainingPlayers();
        };
        Bench.prototype.refreshRemainingPlayers = function () {
            var _this = this;
            this._remainingPlayers = [];
            this._remainingPlayers = this._remainingPlayers.concat(this.dpsPlayers, this.tankPlayers, this.supPlayers, this.otherPlayers);
            var players = "Players in bench: ";
            this._remainingPlayers.forEach(function (p, i) { return players += p.callsign + (i === _this._remainingPlayers.length - 1 ? "" : "; "); });
            console.log(players);
        };
        return Bench;
    }());
    Matchmaker.Bench = Bench;
})(Matchmaker || (Matchmaker = {}));

"use strict";
var Matchmaker;
(function (Matchmaker) {
    var Bench = /** @class */ (function () {
        function Bench() {
            this.tankPlayers = [];
            this.dpsPlayers = [];
            this.supPlayers = [];
            this.otherPlayers = [];
            this.remainingPlayers = [];
        }
        Bench.prototype.benchPlayer = function (player, role) {
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
        };
        Bench.prototype.unbench = function (player) {
            if (this.tankPlayers.indexOf(player) > -1) {
                this.tankPlayers = this.tankPlayers.splice(this.tankPlayers.indexOf(player), 0);
            }
            if (this.dpsPlayers.indexOf(player) > -1) {
                this.dpsPlayers = this.dpsPlayers.splice(this.dpsPlayers.indexOf(player), 0);
            }
            if (this.supPlayers.indexOf(player) > -1) {
                this.supPlayers = this.supPlayers.splice(this.supPlayers.indexOf(player), 0);
            }
            if (this.otherPlayers.indexOf(player) > -1) {
                this.otherPlayers = this.otherPlayers.splice(this.otherPlayers.indexOf(player), 0);
            }
        };
        Bench.prototype.refreshRemainingPlayers = function () {
            this.remainingPlayers = [];
            this.remainingPlayers = this.remainingPlayers.concat(this.dpsPlayers, this.tankPlayers, this.supPlayers, this.otherPlayers);
        };
        return Bench;
    }());
    Matchmaker.Bench = Bench;
})(Matchmaker || (Matchmaker = {}));

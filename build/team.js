"use strict";
var Matchmaker;
(function (Matchmaker) {
    var Team = /** @class */ (function () {
        function Team(name) {
            this._tankPlayers = [];
            this._dpsPlayers = [];
            this._supPlayers = [];
            this._allPlayers = [];
            this._name = name;
        }
        Object.defineProperty(Team.prototype, "tankPlayers", {
            get: function () { return this._tankPlayers; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "dpsPlayers", {
            get: function () { return this._dpsPlayers; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "supPlayers", {
            get: function () { return this._supPlayers; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "allPlayers", {
            get: function () { return this._allPlayers; },
            enumerable: false,
            configurable: true
        });
        Team.prototype.getID = function () {
            var ID = "" + this._name;
            this._allPlayers.forEach(function (p) { return ID += p.callsign; });
            return ID;
        };
        Team.prototype.getGaps = function () {
            var gaps = [];
            if (this._tankPlayers.length === 0) {
                gaps.push(Matchmaker.Player.Role.TANK);
            }
            if (this._dpsPlayers.length === 0) {
                gaps.push(Matchmaker.Player.Role.DPS);
            }
            if (this._supPlayers.length === 0) {
                gaps.push(Matchmaker.Player.Role.SUP);
            }
            if (this._tankPlayers.length === 1) {
                gaps.push(Matchmaker.Player.Role.TANK);
            }
            if (this._dpsPlayers.length === 1) {
                gaps.push(Matchmaker.Player.Role.DPS);
            }
            if (this._supPlayers.length === 1) {
                gaps.push(Matchmaker.Player.Role.SUP);
            }
            return gaps;
        };
        Team.prototype.assignPlayer = function (player, role) {
            switch (role) {
                case Matchmaker.Player.Role.TANK:
                    player.roles.current = Matchmaker.Player.Role.TANK;
                    this._tankPlayers.push(player);
                    this._allPlayers.push(player);
                    break;
                case Matchmaker.Player.Role.DPS:
                    player.roles.current = Matchmaker.Player.Role.DPS;
                    this._dpsPlayers.push(player);
                    this._allPlayers.push(player);
                    break;
                case Matchmaker.Player.Role.SUP:
                    player.roles.current = Matchmaker.Player.Role.SUP;
                    this._supPlayers.push(player);
                    this._allPlayers.push(player);
                    break;
            }
        };
        Team.prototype.swapPlayer = function (player, oldRole, newRole) {
            switch (oldRole) {
                case Matchmaker.Player.Role.TANK:
                    this._tankPlayers = this._tankPlayers.splice(this._tankPlayers.indexOf(player), 0);
                    break;
                case Matchmaker.Player.Role.DPS:
                    this._tankPlayers = this._dpsPlayers.splice(this._dpsPlayers.indexOf(player), 0);
                    break;
                case Matchmaker.Player.Role.SUP:
                    this._tankPlayers = this._supPlayers.splice(this._supPlayers.indexOf(player), 0);
                    break;
            }
            switch (newRole) {
                case Matchmaker.Player.Role.TANK:
                    this._tankPlayers.push(player);
                    player.roles.current = Matchmaker.Player.Role.TANK;
                    break;
                case Matchmaker.Player.Role.DPS:
                    this._dpsPlayers.push(player);
                    player.roles.current = Matchmaker.Player.Role.DPS;
                    break;
                case Matchmaker.Player.Role.SUP:
                    this._supPlayers.push(player);
                    player.roles.current = Matchmaker.Player.Role.SUP;
                    break;
            }
        };
        return Team;
    }());
    Matchmaker.Team = Team;
})(Matchmaker || (Matchmaker = {}));
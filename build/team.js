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
        Object.defineProperty(Team.prototype, "name", {
            get: function () { return this._name; },
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
                gaps.push(Matchmaker.Player.Role.TANK);
            }
            if (this._dpsPlayers.length === 0) {
                gaps.push(Matchmaker.Player.Role.DPS);
                gaps.push(Matchmaker.Player.Role.DPS);
            }
            if (this._supPlayers.length === 0) {
                gaps.push(Matchmaker.Player.Role.SUP);
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
        Team.prototype.getAverage = function () {
            var avg = 0;
            this._tankPlayers.forEach(function (p) { return avg += p.SR.tank; });
            this._dpsPlayers.forEach(function (p) { return avg += p.SR.dps; });
            this._supPlayers.forEach(function (p) { return avg += p.SR.sup; });
            return Math.round(avg / this._allPlayers.length);
        };
        Team.prototype.getDeviation = function () {
            var _this = this;
            var results = [];
            var sqrResults = [];
            this._tankPlayers.forEach(function (p) { return results.push(p.SR.tank); });
            this._dpsPlayers.forEach(function (p) { return results.push(p.SR.dps); });
            this._supPlayers.forEach(function (p) { return results.push(p.SR.sup); });
            results.forEach(function (sr) {
                sqrResults.push(Math.pow(sr - _this.getAverage(), 2));
            });
            var sqrSum = 0;
            sqrResults.forEach(function (r) { return sqrSum += r; });
            return Math.floor(Math.sqrt(sqrSum / this._allPlayers.length));
        };
        Team.prototype.setComp = function () {
            this._name += " - COMP";
        };
        Team.prototype.getPlayers = function (role) {
            switch (role) {
                case Matchmaker.Player.Role.TANK:
                    return this._tankPlayers;
                case Matchmaker.Player.Role.DPS:
                    return this._dpsPlayers;
                case Matchmaker.Player.Role.SUP:
                    return this._supPlayers;
                default:
                    return [];
            }
        };
        Team.prototype.assignPlayer = function (player, role) {
            player.team = this;
            console.log("Assigning " + player.callsign + " to " + this.name);
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
            this.printTeam();
        };
        Team.prototype.removePlayer = function (player, role) {
            console.log("Removing " + player.callsign + " from " + this.name);
            switch (role) {
                case Matchmaker.Player.Role.TANK:
                    this._tankPlayers.splice(this._tankPlayers.indexOf(player), 1);
                    this._allPlayers.splice(this._allPlayers.indexOf(player), 1);
                    break;
                case Matchmaker.Player.Role.DPS:
                    this._dpsPlayers.splice(this._dpsPlayers.indexOf(player), 1);
                    this._allPlayers.splice(this._allPlayers.indexOf(player), 1);
                    break;
                case Matchmaker.Player.Role.SUP:
                    this._supPlayers.splice(this._supPlayers.indexOf(player), 1);
                    this._allPlayers.splice(this._allPlayers.indexOf(player), 1);
                    break;
            }
            this.printTeam();
        };
        Team.prototype.swapPlayer = function (player, oldRole, newRole) {
            console.log("Swapping " + player.callsign + " from role " + oldRole + " to role " + newRole);
            switch (oldRole) {
                case Matchmaker.Player.Role.TANK:
                    this._tankPlayers.splice(this._tankPlayers.indexOf(player), 1);
                    break;
                case Matchmaker.Player.Role.DPS:
                    this._dpsPlayers.splice(this._dpsPlayers.indexOf(player), 1);
                    break;
                case Matchmaker.Player.Role.SUP:
                    this._supPlayers.splice(this._supPlayers.indexOf(player), 1);
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
            this.printTeam();
        };
        Team.prototype.printTeam = function () {
            var _this = this;
            var players = "Players in team " + this.name + ": ";
            this._allPlayers.forEach(function (p, i) { return players += p.callsign + (i === _this._allPlayers.length - 1 ? "" : "; "); });
            console.log(players);
        };
        return Team;
    }());
    Matchmaker.Team = Team;
})(Matchmaker || (Matchmaker = {}));

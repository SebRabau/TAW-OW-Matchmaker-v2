"use strict";
var Matchmaker;
(function (Matchmaker) {
    var Player = /** @class */ (function () {
        function Player(callsign, SR, roles) {
            this._team = new Matchmaker.Team("NO TEAM");
            this._callsign = callsign;
            this._SR = SR;
            this._roles = roles;
        }
        Object.defineProperty(Player.prototype, "callsign", {
            get: function () { return this._callsign; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "SR", {
            get: function () { return this._SR; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "roles", {
            get: function () { return this._roles; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "team", {
            get: function () { return this._team; },
            set: function (value) { this._team = value; },
            enumerable: false,
            configurable: true
        });
        Player.prototype.canPlay = function (role) {
            switch (role) {
                case Player.Role.TANK:
                    return this._roles.tank;
                case Player.Role.DPS:
                    return this._roles.dps;
                case Player.Role.SUP:
                    return this._roles.sup;
                default:
                    return false;
            }
        };
        Player.prototype.getSR = function (role) {
            switch (role) {
                case Player.Role.TANK:
                    return this._SR.tank;
                case Player.Role.DPS:
                    return this._SR.dps;
                case Player.Role.SUP:
                    return this._SR.sup;
                default:
                    return 0;
            }
        };
        return Player;
    }());
    Matchmaker.Player = Player;
    (function (Player) {
        var Role;
        (function (Role) {
            Role[Role["TANK"] = 0] = "TANK";
            Role[Role["DPS"] = 1] = "DPS";
            Role[Role["SUP"] = 2] = "SUP";
            Role[Role["NONE"] = 3] = "NONE";
        })(Role = Player.Role || (Player.Role = {}));
    })(Player = Matchmaker.Player || (Matchmaker.Player = {}));
})(Matchmaker || (Matchmaker = {}));

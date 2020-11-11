"use strict";
var Matchmaker;
(function (Matchmaker) {
    var Player = /** @class */ (function () {
        function Player(callsign, SR, roles) {
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
//# sourceMappingURL=player.js.map
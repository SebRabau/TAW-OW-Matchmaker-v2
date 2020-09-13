"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Matchmaker;
(function (Matchmaker_1) {
    var Matchmaker = /** @class */ (function () {
        function Matchmaker() {
            this._attendedPlayers = [];
        }
        Matchmaker.prototype.run = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.showButton(false)) {
                        // Do not run matchmaker
                        throw Error("Matchmaker is Already Running");
                    }
                    if (!this.getAttendance()) {
                        // Do not run matchmaker
                        throw Error;
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Show or Hide button. Returns true if matchmaker should continue, or false
         * to stop the matchmaker from executing (for instance if it is already running).
         * @param show Show or Hide button
         */
        Matchmaker.prototype.showButton = function (show) {
            var button = document.getElementById("Generate");
            // If we can't find element, stop
            if (!button) {
                return false;
            }
            // If button already hidden, stop
            if (button.style.display === "none" && !show) {
                return false;
            }
            button.style.display = show ? "block" : "none";
            // Continue
            return true;
        };
        /**
         * Get Attendance from the textarea.
         */
        Matchmaker.prototype.getAttendance = function () {
            var attendance = document.getElementById("Attendance");
            if (!attendance) {
                this.error("Element not found");
                return false;
            }
            if (attendance.value.length === 0) {
                this.error("Attendance not supplied. Paste event attendance in the text area.");
                return false;
            }
            return this.parseAttendance(attendance.value);
        };
        /**
         * Parse attendance into usable map.
         * @param attendance Attendance from textarea
         */
        Matchmaker.prototype.parseAttendance = function (attendance) {
            var _this = this;
            var map = [];
            // Map attendance
            var lines = attendance.split("\n");
            lines.forEach(function (l) {
                var elems = l.split("\t");
                map.push(elems);
            });
            // Store attended people
            map.forEach(function (e) {
                // Check map element is not invalid data
                if (e.length === 3 && e[0] != "Name" && e[1] === "attended") {
                    _this._attendedPlayers.push(e[0]);
                }
            });
            return true;
        };
        Matchmaker.prototype.error = function (msg) {
            this.showButton(true);
            alert(msg);
        };
        return Matchmaker;
    }());
    Matchmaker_1.Matchmaker = Matchmaker;
})(Matchmaker || (Matchmaker = {}));
/// <reference path="matchmaker.ts" />
function start() {
    var matchmaker = new Matchmaker.Matchmaker();
    matchmaker.run();
}
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
        })(Role = Player.Role || (Player.Role = {}));
    })(Player = Matchmaker.Player || (Matchmaker.Player = {}));
})(Matchmaker || (Matchmaker = {}));
//# sourceMappingURL=app.js.map
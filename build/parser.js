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
var playerDatabase = [];
var Matchmaker;
(function (Matchmaker) {
    var Parser = /** @class */ (function () {
        function Parser(context) {
            this.context = context;
            this._playersMap = new Map();
            this._playersToMatchmake = [];
            this._playerInDatabase = [];
            this._attendingPlayers = [];
        }
        Object.defineProperty(Parser.prototype, "playersToMatchmake", {
            get: function () { return this._playersToMatchmake; },
            enumerable: true,
            configurable: true
        });
        /**
         * Get Attendance from the textarea, then process the information against
         * database player info to get the available players for the day.
         */
        Parser.prototype.getAttendance = function () {
            return __awaiter(this, void 0, void 0, function () {
                var attendance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            attendance = document.getElementById("Attendance");
                            if (!attendance) {
                                this.error("Element not found");
                                return [2 /*return*/, false];
                            }
                            if (attendance.value.length === 0) {
                                this.error("Attendance not supplied. Paste event attendance in the text area.");
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, this.getPlayerData()];
                        case 1:
                            _a.sent();
                            if (playerDatabase.length > 0) {
                                this.createPlayers();
                            }
                            else {
                                this.error("Error getting data from spreadsheet.");
                                return [2 /*return*/, false];
                            }
                            this._attendingPlayers = this.parseAttendance(attendance.value);
                            if (!this._attendingPlayers) {
                                this.error("Error parsing Attendance");
                                return [2 /*return*/, false];
                            }
                            else {
                                this.listAvailablePlayers(this._attendingPlayers);
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Parser.prototype.getPlayerData = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, gapi.client.sheets.spreadsheets.values.get({
                                spreadsheetId: '1pRriIo_BLP3RWQ8Hjg9LfSg-ytl9CEn6ct9C4dYry8k',
                                range: 'Sheet1!A2:F100',
                            }).then(function (response) {
                                var range = response.result;
                                if (range.values.length > 0) {
                                    for (var i = 0; i < range.values.length; i++) {
                                        var row = range.values[i];
                                        playerDatabase.push([row[0], row[1], row[2], row[3], row[4], row[5]]);
                                        //appendPre(row[0]+", ["+row[1]+"-"+row[2]+"-"+row[3]+"], "+row[4]+", "+row[5]);
                                    }
                                }
                                else {
                                    alert("No Spreadsheet data found.");
                                }
                            }, function (response) {
                                alert('Error: ' + response.result.error.message);
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Parse attendance into usable map.
         * @param attendance Attendance from textarea
         */
        Parser.prototype.parseAttendance = function (attendance) {
            var map = [];
            var players = [];
            // Map attendance
            var lines = attendance.split("\n");
            lines.forEach(function (l) {
                var elems = l.replace(/ /g, "").split('\u0009');
                map.push(elems);
            });
            // Store attended people
            map.forEach(function (e) {
                // Check map element is not invalid data
                if (e.length === 3 && e[0] != "Name" && e[1] === "attended" && e[0].indexOf("#") === -1) {
                    players.push(e[0]);
                }
            });
            return players;
        };
        /**
         * Parse database palyer info, then creates a list of player objects and a complementary
         * list of callsigns.
         */
        Parser.prototype.createPlayers = function () {
            var _this = this;
            if (playerDatabase[0][0] === "Callsign") {
                playerDatabase.splice(0, 1);
            }
            playerDatabase.forEach(function (p) {
                var player = _this.createPlayer(p[0], p[1], p[2], p[3], p[4], p[5]);
                _this._playersMap.set(player.callsign, player);
                _this._playerInDatabase.push(player.callsign);
            });
        };
        /**
         * Creates a player object from database data.
         * @param callsign Callsign
         * @param tankSR Tank SR
         * @param dpsSR DPS SR
         * @param supSR Support SR
         * @param roles Roles player will play
         * @param prefRole Preffered role
         */
        Parser.prototype.createPlayer = function (callsign, tankSR, dpsSR, supSR, roles, prefRole) {
            var prefRoleObj;
            switch (prefRole) {
                case "d":
                    prefRoleObj = Matchmaker.Player.Role.DPS;
                    break;
                case "t":
                    prefRoleObj = Matchmaker.Player.Role.TANK;
                    break;
                case "s":
                    prefRoleObj = Matchmaker.Player.Role.SUP;
                    break;
                default:
                    prefRoleObj = Matchmaker.Player.Role.NONE;
                    break;
            }
            var rolesObj = {
                dps: roles.indexOf("d") > -1,
                tank: roles.indexOf("t") > -1,
                sup: roles.indexOf("s") > -1,
                preffered: prefRoleObj,
                current: Matchmaker.Player.Role.NONE
            };
            return new Matchmaker.Player(callsign, { tank: Number.parseInt(tankSR), dps: Number.parseInt(dpsSR), sup: Number.parseInt(supSR) }, rolesObj);
        };
        /**
         * Lists players that have shown up to the event and matches them against the players in the
         * database, listing any missing members separately.
         * @param players List of players that showed up to the event
         */
        Parser.prototype.listAvailablePlayers = function (players) {
            var _this = this;
            var parent = document.getElementById("Attendance");
            var missing = document.getElementById("MissingPlayers");
            if (parent && missing) {
                var list_1 = "Available players: \n\n";
                // List of players who've shown up but aren't in spreadsheet
                var missingPlayerList_1 = "Missing players (check spreadsheet): \n\n";
                var missingPlayers_1 = [];
                players.forEach(function (p) {
                    if (_this._playerInDatabase.indexOf(p) === -1) {
                        missingPlayerList_1 += p.toString() + "\n";
                        missingPlayers_1.push(p);
                    }
                    else {
                        list_1 += p.toString() + "\n";
                        _this._playersToMatchmake.push(_this._playersMap.get(p));
                    }
                });
                parent.value = list_1;
                parent.disabled = true;
                parent.scrollTop = 0;
                missing.innerText = missingPlayers_1.length > 0 ? missingPlayerList_1 : "";
            }
        };
        /**
         * Does an error alert and shows the button so you can try again.
         * @param msg Message
         */
        Parser.prototype.error = function (msg) {
            this.context.showButton(true);
            alert(msg);
        };
        return Parser;
    }());
    Matchmaker.Parser = Parser;
})(Matchmaker || (Matchmaker = {}));

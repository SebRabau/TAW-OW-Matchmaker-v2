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
            this._parser = null;
            this._defaultTeamNames = ['Naughty Tomatoes', 'Strike Team 404', 'Suwon Tigers', 'Lucky Runners', 'Raccoon Ravagers', 'Pesky Pachimaris', 'Team 7', 'Team 8'];
            this._tankPlayers = [];
            this._dpsPlayers = [];
            this._supPlayers = [];
            this._otherPlayers = [];
            this._teamCount = 0;
            this._teams = [];
            this._bench = new Matchmaker_1.Bench();
        }
        Matchmaker.prototype.run = function () {
            return __awaiter(this, void 0, void 0, function () {
                var valid;
                return __generator(this, function (_a) {
                    if (!this.showButton(false)) {
                        // Do not run matchmaker
                        throw Error("Matchmaker is Already Running");
                    }
                    this._parser = new Matchmaker_1.Parser(this);
                    valid = this._parser.getAttendance();
                    if (!valid) {
                        // Do not run matchmaker
                        throw Error;
                    }
                    this.sortPlayerIntoRoles(this._parser.playersToMatchmake);
                    this._teamCount = Math.floor(this._parser.playersToMatchmake.length / 6);
                    this.createTeams();
                    this.randFillTeams();
                    this.createBench();
                    this.startLoop();
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
        Matchmaker.prototype.createTeams = function () {
            for (var i = 0; i < this._teamCount; i++) {
                this._teams.push(new Matchmaker_1.Team(this._defaultTeamNames[i]));
            }
        };
        Matchmaker.prototype.createBench = function () {
            var _this = this;
            this._tankPlayers.forEach(function (p) { return _this._bench.benchPlayer(p, Matchmaker_1.Player.Role.TANK); });
            this._dpsPlayers.forEach(function (p) { return _this._bench.benchPlayer(p, Matchmaker_1.Player.Role.DPS); });
            this._supPlayers.forEach(function (p) { return _this._bench.benchPlayer(p, Matchmaker_1.Player.Role.SUP); });
        };
        Matchmaker.prototype.randFillTeams = function () {
            var _this = this;
            this._tankPlayers = this.shufflePlayers(this._tankPlayers);
            this._dpsPlayers = this.shufflePlayers(this._dpsPlayers);
            this._supPlayers = this.shufflePlayers(this._supPlayers);
            this._teams.forEach(function (t, i) {
                for (var j = 0; j < 2; j++) {
                    if (_this._tankPlayers.length > 0) {
                        t.assignPlayer(_this._tankPlayers.pop(), Matchmaker_1.Player.Role.TANK);
                    }
                    if (_this._dpsPlayers.length > 0) {
                        t.assignPlayer(_this._dpsPlayers.pop(), Matchmaker_1.Player.Role.DPS);
                    }
                    if (_this._supPlayers.length > 0) {
                        t.assignPlayer(_this._supPlayers.pop(), Matchmaker_1.Player.Role.SUP);
                    }
                }
            });
        };
        Matchmaker.prototype.sortPlayerIntoRoles = function (players) {
            var _this = this;
            this._tankPlayers = [];
            this._dpsPlayers = [];
            this._supPlayers = [];
            players.forEach(function (p) {
                if (p.roles.preffered === Matchmaker_1.Player.Role.TANK) {
                    _this._tankPlayers.push(p);
                }
                else if (p.roles.preffered === Matchmaker_1.Player.Role.DPS) {
                    _this._dpsPlayers.push(p);
                }
                else if (p.roles.preffered === Matchmaker_1.Player.Role.SUP) {
                    _this._supPlayers.push(p);
                }
                else {
                    _this._otherPlayers.push(p);
                    _this._bench.benchPlayer(p, Matchmaker_1.Player.Role.NONE);
                }
            });
        };
        Matchmaker.prototype.startLoop = function () {
            var totalID = "";
            this._teams.forEach(function (t) { return totalID += t.getID(); });
            var oldID = "";
            var counter = 0;
            while (oldID != totalID && counter < 20) {
                this.fillBlanks();
                //this.balance();
                oldID = totalID;
                totalID = "";
                this._teams.forEach(function (t) { return totalID += t.getID(); });
                counter++;
            }
        };
        Matchmaker.prototype.fillBlanks = function () {
            var _this = this;
            var count = 1;
            // Fill as many blanks on team as possible with bench players
            while (count != 0) {
                count = 0;
                this._teams.forEach(function (t) {
                    var gaps = t.getGaps();
                    if (gaps.length === 0) {
                        console.log("No Gaps in team: " + t.getID());
                    }
                    else {
                        count += gaps.length;
                    }
                    gaps.forEach(function (r) {
                        if (r === Matchmaker_1.Player.Role.TANK) {
                            if (_this._bench.tankPlayers.length > 0) {
                                var p = _this._bench.tankPlayers.pop();
                                t.assignPlayer(p, Matchmaker_1.Player.Role.TANK);
                                _this._bench.unbench(p);
                                count--;
                            }
                        }
                        else if (r === Matchmaker_1.Player.Role.DPS) {
                            if (_this._bench.dpsPlayers.length > 0) {
                                var p = _this._bench.dpsPlayers.pop();
                                t.assignPlayer(p, Matchmaker_1.Player.Role.DPS);
                                _this._bench.unbench(p);
                                count--;
                            }
                        }
                        else if (r === Matchmaker_1.Player.Role.SUP) {
                            if (_this._bench.supPlayers.length > 0) {
                                var p = _this._bench.supPlayers.pop();
                                t.assignPlayer(p, Matchmaker_1.Player.Role.SUP);
                                _this._bench.unbench(p);
                                count--;
                            }
                        }
                    });
                });
                if (count === 0) {
                    return;
                }
                // Slot in bench players that play gap roles
                this._teams.forEach(function (t) {
                    var gaps = t.getGaps();
                    gaps.forEach(function (r) {
                        _this._bench.refreshRemainingPlayers();
                        _this._bench.remainingPlayers.forEach(function (p) {
                            if (r === Matchmaker_1.Player.Role.TANK && p.roles.tank) {
                                t.assignPlayer(p, Matchmaker_1.Player.Role.TANK);
                                _this._bench.unbench(p);
                                count--;
                            }
                            else if (r === Matchmaker_1.Player.Role.DPS && p.roles.dps) {
                                t.assignPlayer(p, Matchmaker_1.Player.Role.DPS);
                                _this._bench.unbench(p);
                                count--;
                            }
                            else if (r === Matchmaker_1.Player.Role.SUP && p.roles.sup) {
                                t.assignPlayer(p, Matchmaker_1.Player.Role.SUP);
                                _this._bench.unbench(p);
                                count--;
                            }
                        });
                    });
                });
                if (count === 0) {
                    return;
                }
                // Try to swap people already in team to cover roles
                this._teams.forEach(function (t) {
                    var gaps = t.getGaps();
                    gaps.forEach(function (r) {
                        t.allPlayers.forEach(function (p) {
                            if (r === Matchmaker_1.Player.Role.TANK && p.roles.tank && p.roles.current != Matchmaker_1.Player.Role.TANK) {
                                t.swapPlayer(p, p.roles.current, Matchmaker_1.Player.Role.TANK);
                                count--;
                            }
                            else if (r === Matchmaker_1.Player.Role.DPS && p.roles.dps && p.roles.current != Matchmaker_1.Player.Role.DPS) {
                                t.swapPlayer(p, p.roles.current, Matchmaker_1.Player.Role.DPS);
                                count--;
                            }
                            else if (r === Matchmaker_1.Player.Role.SUP && p.roles.sup && p.roles.current != Matchmaker_1.Player.Role.SUP) {
                                t.swapPlayer(p, p.roles.current, Matchmaker_1.Player.Role.SUP);
                                count--;
                            }
                        });
                    });
                });
                this._teams;
            }
        };
        Matchmaker.prototype.shufflePlayers = function (array) {
            var _a;
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
            }
            return array;
        };
        return Matchmaker;
    }());
    Matchmaker_1.Matchmaker = Matchmaker;
})(Matchmaker || (Matchmaker = {}));

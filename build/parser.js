"use strict";
var Matchmaker;
(function (Matchmaker) {
    var spreadsheetUrl = "https://spreadsheets.google.com/feeds/cells/1pRriIo_BLP3RWQ8Hjg9LfSg-ytl9CEn6ct9C4dYry8k/1/public/values?alt=json-in-script";
    // Create JSONP Request to Google Docs API, then execute the callback function getData
    var request = $.ajax({
        url: spreadsheetUrl,
        success: function (data) { getData(data); },
        dataType: 'jsonp'
    });
    // The callback function the JSONP request will execute to load data from API
    function getData(data) {
        // Final results will be stored here	
        var results = [];
        // Get all entries from spreadsheet
        var entries = data.feed.entry;
        // Set initial previous row, so we can check if the data in the current cell is from a new row
        var previousRow = 0;
        // Iterate all entries in the spreadsheet
        for (var i = 0; i < entries.length; i++) {
            // check what was the latest row we added to our result array, then load it to local variable
            var latestRow = results[results.length - 1];
            // get current cell
            var cell = entries[i];
            // get text from current cell
            var text = cell.content.$t;
            // get the current row
            var row = cell.gs$cell.row;
            // Determine if the current cell is in the latestRow or is a new row
            if (row > previousRow) {
                // this is a new row, create new array for this row
                var newRow = [];
                // add the cell text to this new row array  
                newRow.push(text);
                // store the new row array in the final results array
                results.push(newRow);
                // Increment the previous row, since we added a new row to the final results array
                previousRow++;
            }
            else {
                // This cell is in an existing row we already added to the results array, add text to this existing row
                latestRow.push(text);
            }
        }
        handleResults(results);
    }
    // Do what ever you please with the final array
    function handleResults(spreadsheetArray) {
        playerDatabase = spreadsheetArray;
    }
    var playerDatabase = [];
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
            enumerable: false,
            configurable: true
        });
        /**
         * Get Attendance from the textarea, then process the information against
         * database player info to get the available players for the day.
         */
        Parser.prototype.getAttendance = function () {
            var attendance = document.getElementById("Attendance");
            if (!attendance) {
                this.error("Element not found");
                return false;
            }
            if (attendance.value.length === 0) {
                this.error("Attendance not supplied. Paste event attendance in the text area.");
                return false;
            }
            if (playerDatabase) {
                this.createPlayers();
            }
            else {
                this.error("Error getting data from spreadsheet.");
                return false;
            }
            this._attendingPlayers = this.parseAttendance(attendance.value);
            if (!this._attendingPlayers) {
                this.error("Error parsing Attendance");
                return false;
            }
            else {
                this.listAvailablePlayers(this._attendingPlayers);
            }
            return true;
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

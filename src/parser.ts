namespace Matchmaker
{
    const spreadsheetUrl = "https://spreadsheets.google.com/feeds/cells/1pRriIo_BLP3RWQ8Hjg9LfSg-ytl9CEn6ct9C4dYry8k/1/public/values?alt=json-in-script";

    // Create JSONP Request to Google Docs API, then execute the callback function getData
    const request = $.ajax(
    {
        url: spreadsheetUrl,
        success: function(data) { getData(data) },
        dataType: 'jsonp'
    });

    // The callback function the JSONP request will execute to load data from API
    function getData(data: any)
    {
        // Final results will be stored here	
        var results = [];

        // Get all entries from spreadsheet
        var entries = data.feed.entry;

        // Set initial previous row, so we can check if the data in the current cell is from a new row
        var previousRow = 0;

        // Iterate all entries in the spreadsheet
        for (var i = 0; i < entries.length; i++)
        {
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
            } else {
                // This cell is in an existing row we already added to the results array, add text to this existing row
                latestRow.push(text);
            }

        }

        handleResults(results);
    }

    // Do what ever you please with the final array
    function handleResults(spreadsheetArray: any)
    {
        playerDatabase = spreadsheetArray;
    }

    let playerDatabase: any[][] = [];

    export class Parser
    {
        protected _playersMap: Map<string, Player> = new Map();
        protected _playersToMatchmake: Player[] = [];
        protected _playerInDatabase: string[] = [];
        protected _attendingPlayers: string[] | boolean = [];

        public get playersToMatchmake() { return this._playersToMatchmake; }

        constructor(protected context: Matchmaker) {}

        /**
         * Get Attendance from the textarea, then process the information against
         * database player info to get the available players for the day.
         */
        public getAttendance(): boolean
        {
            const attendance = document.getElementById("Attendance") as HTMLTextAreaElement;

            if (!attendance)
            {
                this.error("Element not found");
                return false;
            }

            if (attendance.value.length === 0)
            {
                this.error("Attendance not supplied. Paste event attendance in the text area.");
                return false;
            }

            if (playerDatabase)
            {
                this.createPlayers();
            }
            else
            {
                this.error("Error getting data from spreadsheet.");
                return false;
            }

            this._attendingPlayers = this.parseAttendance(attendance.value);
            if (!this._attendingPlayers)
            {
                this.error("Error parsing Attendance");
                return false;
            }
            else
            {
                this.listAvailablePlayers(this._attendingPlayers as string[])
            }

            return true;
        }

        /**
         * Parse attendance into usable map.
         * @param attendance Attendance from textarea
         */
        public parseAttendance(attendance: string): string[] | boolean
        {
            const map: string[][] = [];
            const players: string[] = [];

            // Map attendance
            const lines = attendance.split("\n");
            lines.forEach((l) =>
            {
                const elems = l.split("\t");
                map.push(elems);
            });

            // Store attended people
            map.forEach((e) =>
            {
                // Check map element is not invalid data
                if (e.length === 3 && e[0] != "Name" && e[1] === "attended" && e[0].indexOf("#") === -1)
                {
                    players.push(e[0]);
                }
            });

            return players;
        }

        /**
         * Parse database palyer info, then creates a list of player objects and a complementary
         * list of callsigns.
         */
        protected createPlayers()
        {
            if (playerDatabase[0][0] === "Callsign")
            {
                playerDatabase.splice(0, 1);
            }

            playerDatabase.forEach((p) =>
            {
                const player = this.createPlayer(p[0], p[1], p[2], p[3], p[4], p[5]);
                this._playersMap.set(player.callsign, player);
                this._playerInDatabase.push(player.callsign);
            })
        }

        /**
         * Creates a player object from database data.
         * @param callsign Callsign
         * @param tankSR Tank SR
         * @param dpsSR DPS SR
         * @param supSR Support SR
         * @param roles Roles player will play
         * @param prefRole Preffered role
         */
        protected createPlayer(callsign: string, tankSR: string, dpsSR: string, supSR: string, roles: string, prefRole: string): Player
        {
            let prefRoleObj;

            switch (prefRole)
            {
                case "d":
                    prefRoleObj = Player.Role.DPS;
                    break;
                case "t":
                    prefRoleObj = Player.Role.TANK;
                    break;
                case "s":
                    prefRoleObj = Player.Role.SUP;
                    break;
                default:
                    prefRoleObj = Player.Role.NONE;
                    break;
            }

            const rolesObj: Player.Roles =
            {
                dps: roles.indexOf("d") > -1,
                tank: roles.indexOf("t") > -1,
                sup: roles.indexOf("s") > -1,
                preffered: prefRoleObj,
                current: Player.Role.NONE
            }

            return new Player(callsign, { tank: Number.parseInt(tankSR), dps: Number.parseInt(dpsSR), sup: Number.parseInt(supSR) }, rolesObj);
        }

        /**
         * Lists players that have shown up to the event and matches them against the players in the
         * database, listing any missing members separately.
         * @param players List of players that showed up to the event
         */
        protected listAvailablePlayers(players: string[])
        {
            const parent = document.getElementById("Attendance") as HTMLTextAreaElement;
            const missing = document.getElementById("MissingPlayers") as HTMLDivElement;
            if (parent && missing)
            {
                let list = "Available players: \n\n";

                // List of players who've shown up but aren't in spreadsheet
                let missingPlayerList = "Missing players (check spreadsheet): \n\n";
                let missingPlayers = [];

                players.forEach((p) =>
                {
                    if (this._playerInDatabase.indexOf(p) === -1)
                    {
                        missingPlayerList += p.toString() + "\n";
                        missingPlayers.push(p);
                    }
                    else
                    {
                        list += p.toString() + "\n";
                        this._playersToMatchmake.push(this._playersMap.get(p) as Player);
                    }
                });

                parent.value = list;
                parent.disabled = true;
                parent.scrollTop = 0;

                missing.innerText = missingPlayers.length > 0 ? missingPlayerList : "";
            }
        }

        /**
         * Does an error alert and shows the button so you can try again.
         * @param msg Message
         */
        protected error(msg: string)
        {
            this.context.showButton(true);
            alert(msg);
        }
    }
}
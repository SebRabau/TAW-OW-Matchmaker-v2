
let playerDatabase: any[][] = [];

namespace Matchmaker
{
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
        public async getAttendance(): Promise<boolean>
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

            await this.getPlayerData();

            if (playerDatabase.length > 0)
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

        public async getPlayerData()
        {
            await gapi.client.sheets.spreadsheets.values.get(
            {
                spreadsheetId: '1pRriIo_BLP3RWQ8Hjg9LfSg-ytl9CEn6ct9C4dYry8k',
                range: 'Sheet1!A2:F100',
            }).then(function(response: any)
            {
                var range = response.result;
                if (range.values.length > 0)
                {
                    for (let i = 0; i < range.values.length; i++)
                    {
                        var row = range.values[i];
                        playerDatabase.push([ row[0], row[1], row[2], row[3], row[4], row[5] ]);
                        //appendPre(row[0]+", ["+row[1]+"-"+row[2]+"-"+row[3]+"], "+row[4]+", "+row[5]);
                    }
                }
                else
                {
                    alert("No Spreadsheet data found.");
                }
            },
            function(response)
            {
                alert('Error: ' + response.result.error.message);
            });
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
                const elems = l.replace(/ /g, "").split('\u0009');
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
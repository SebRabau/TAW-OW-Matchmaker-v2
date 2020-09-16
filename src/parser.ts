namespace Matchmaker
{
    export class Parser
    {
        constructor(protected context: Matchmaker) {}

        /**
         * Get Attendance from the textarea.
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

            const players = this.parseAttendance(attendance.value);
            if (!players)
            {
                this.error("Error parsing Attendance");
                return false;
            }
            else
            {
                this.listAvailablePlayers(players as String[])
            }

            return true;
        }

        /**
         * Parse attendance into usable map.
         * @param attendance Attendance from textarea
         */
        public parseAttendance(attendance: string): String[] | boolean
        {
            const map: String[][] = [];
            const players: String[] = [];

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

        protected listAvailablePlayers(players: String[])
        {
            const parent = document.getElementById("Attendance") as HTMLTextAreaElement;
            if (parent)
            {
                let list = "Available players: \n\n";

                players.forEach((p) =>
                {
                    list = list + p.toString() + "\n";
                });

                list = list.slice(0, list.length - 1);

                parent.value = list;
                parent.disabled = true;
                parent.scrollTop = 0;
            }
        }

        protected error(msg: string)
        {
            this.context.showButton(true);
            alert(msg);
        }
    }
}
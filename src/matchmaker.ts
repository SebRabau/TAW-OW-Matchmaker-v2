namespace Matchmaker
{
    export class Matchmaker
    {
        protected _attendedPlayers: String[] = [];

        constructor() {}

        public async run()
        {
            if (!this.showButton(false))
            {
                // Do not run matchmaker
                throw Error("Matchmaker is Already Running");
            }

            if (!this.getAttendance())
            {
                // Do not run matchmaker
                throw Error;
            }
            
        }

        /**
         * Show or Hide button. Returns true if matchmaker should continue, or false
         * to stop the matchmaker from executing (for instance if it is already running).
         * @param show Show or Hide button
         */
        protected showButton(show: boolean): boolean
        {
            const button = document.getElementById("Generate");

            // If we can't find element, stop
            if (!button) { return false; }

            // If button already hidden, stop
            if (button.style.display === "none" && !show) { return false; }

            button.style.display = show ? "block" : "none";

            // Continue
            return true;
        }

        /**
         * Get Attendance from the textarea.
         */
        protected getAttendance(): boolean
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

            return this.parseAttendance(attendance.value);
        }

        /**
         * Parse attendance into usable map.
         * @param attendance Attendance from textarea
         */
        protected parseAttendance(attendance: string):boolean
        {
            const map: String[][] = [];

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
                if (e.length === 3 && e[0] != "Name" && e[1] === "attended")
                {
                    this._attendedPlayers.push(e[0]);
                }
            });

            return true;
        }

        protected error(msg: string)
        {
            this.showButton(true);
            alert(msg);
        }
    }
}
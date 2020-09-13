namespace Matchmaker
{
    export class Matchmaker
    {
        protected _attendance: HTMLElement | null = null;

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
            const attendance = document.getElementById("Attendance");

            if (!attendance)
            {
                this.error("Element not found");
                return false;
            }

            if (attendance.innerText.length === 0)
            {
                this.error("Attendance not supplied. Paste event attendance in the text area.");
                return false;
            }

            return this.parseAttendance(attendance.innerText);
        }

        /**
         * Parse attendance into usable map.
         * @param attendance Attendance from textarea
         */
        protected parseAttendance(attendance: string):boolean
        {
            return true;
        }

        protected error(msg: string)
        {
            this.showButton(true);
            alert(msg);
        }
    }
}
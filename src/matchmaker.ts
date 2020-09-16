namespace Matchmaker
{
    export class Matchmaker
    {
        constructor() {}

        public async run()
        {
            if (!this.showButton(false))
            {
                // Do not run matchmaker
                throw Error("Matchmaker is Already Running");
            }

            const valid = new Parser(this).getAttendance();

            if (!valid)
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
        public showButton(show: boolean): boolean
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
    }
}
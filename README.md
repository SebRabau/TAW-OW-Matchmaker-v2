# Disclaimer - In a mostly finished state but no longer have any affiliation with TAW, thus this is no longer used nor in active development and likely won't work given input requirements

# Overwatch Auto-Phil Matchmaker for TAW Gaming Community
## How to build

To build a dev build (creates only app.js), in root run `sh build_dev.sh`.
To build a closure compiled build (clojure compiles app.js into app-compiled.js), in root run `sh build_closure.sh`.

You can also use `tsc -w` for the compiler to watch for changes and build each time you save.

If you don't have typescript, you will need to install node if you haven't already ([https://nodejs.org/en/](https://nodejs.org/en/)), then run `npm install -g typescript`.

## How to Run

This has been designed to work with the attendance format of TAW events. View an event's attendance, then select all members from top left to bottom right, then copy and paste in the box on the webpage. Users will be matched against a google spreadsheet. A way of automating adding and updating player information is currently WIP.

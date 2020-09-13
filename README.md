# Overwatch Matchmaker for TAW Gaming Community
Find out more about The Art of Warfare (TAW) Gaming Community here: [www.taw.net](www.taw.net).

## How to build

To build a dev build (creates only app.js), in root run `sh build_dev.sh`.
To build a closure compiled build (clojure compiles app.js into app-compiled.js), in root run `sh build_closure.sh`.

You can also use `tsc -w` for the compiler to watch for changes and build each time you save.

If you don't have typescript, you will need to install node if you haven't already ([https://nodejs.org/en/](https://nodejs.org/en/)), then run `npm install -g typescript`.
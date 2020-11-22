"use strict";
/// <reference path="matchmaker.ts" />
function start() {
    var matchmaker = new Matchmaker.Matchmaker();
    matchmaker.run();
}
function loadScripts() {
    var directory = 'build/';
    var extension = '.js';
    var files = ["matchmaker", "parser", "player", "team", "bench", "switcher", "benchSwitcher"];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var path = directory + file + extension;
        var script = document.createElement("script");
        script.src = path;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}

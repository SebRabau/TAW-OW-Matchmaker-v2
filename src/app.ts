/// <reference path="matchmaker.ts" />

function start()
{
    const matchmaker = new Matchmaker.Matchmaker();
    matchmaker.run();
}

function loadScripts()
{
    var directory = 'build/';
    var extension = '.js';
    var files = ["matchmaker", "parser", "player", "team", "bench" ];
    for (var file of files)
    {
        var path = directory + file + extension;
        var script = document.createElement("script");
        script.src = path;
        document.getElementsByTagName("head")[0].appendChild(script);
    } 
}
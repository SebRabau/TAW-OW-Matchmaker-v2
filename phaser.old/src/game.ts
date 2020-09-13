import "phaser";
import { MainScene } from "./scenes/main-scene";

// main game configuration
const config: Phaser.Types.Core.GameConfig =
{
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: "game",
    scene: MainScene,
    backgroundColor: "#fff",
    dom:
    {
        createContainer: true
    }
};

export let game: Game;

export class Game extends Phaser.Game
{
    constructor(config: Phaser.Types.Core.GameConfig)
    {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () =>
{
    game = new Game(config);

    const resize = () =>
    {
        let width = window.innerWidth;
        let height = window.innerHeight;

        // resize the game
        game.scale.resize(width, height);
    };

    window.addEventListener("resize", resize);
});

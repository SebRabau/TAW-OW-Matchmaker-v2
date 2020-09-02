import "phaser";
import { MainScene } from "./scenes/main-scene";

// main game configuration
const config: Phaser.Types.Core.GameConfig =
{
    width: window.innerWidth * 0.98,
    height: window.innerHeight * 0.9,
    type: Phaser.AUTO,
    parent: "game",
    scene: MainScene,
    backgroundColor: "#fff"
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
        let width = window.innerWidth * 0.98;
        let height = window.innerHeight * 0.9;

        // resize the game
        game.scale.resize(width, height);
    };

    window.addEventListener("resize", resize);
});


// import 'phaser';

// export default class Demo extends Phaser.Scene
// {
//     constructor ()
//     {
//         super('demo');
//     }

//     preload ()
//     {
//         this.load.image('logo', 'assets/phaser3-logo.png');
//         this.load.image('libs', 'assets/libs.png');
//         this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
//         this.load.glsl('stars', 'assets/starfields.glsl.js');
//     }

//     create ()
//     {
//         this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

//         this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

//         this.add.image(400, 300, 'libs');

//         const logo = this.add.image(400, 70, 'logo');

//         this.tweens.add({
//             targets: logo,
//             y: 350,
//             duration: 1500,
//             ease: 'Sine.inOut',
//             yoyo: true,
//             repeat: -1
//         })
//     }
// }

// const config = {
//     type: Phaser.AUTO,
//     backgroundColor: '#125555',
//     width: 800,
//     height: 600,
//     scene: Demo
// };

// const game = new Phaser.Game(config);

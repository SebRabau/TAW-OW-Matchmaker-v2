export class MainScene extends Phaser.Scene
{
    protected _logo: Phaser.GameObjects.Image;
    protected _background: Phaser.GameObjects.Image;

    constructor()
    {
        super({ key: "MainScene" });
        window.addEventListener("resize", this.handleOrientationChanged.bind(this));
    }

    protected preload(): void
    {
        // load out package
        this.load.pack("preload", "../../dist/assets/manifest.json", "preload");
    }

    protected create(): void
    {
        // this._background = this.add.image(0, 0, "background");
        // this._background.setOrigin(0, 0);
        // this._background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);
        this._logo = this.add.image(0, 0, "logo");
        this._logo.setScale(0.5, 0.5);

        this.handleOrientationChanged();
    }

    protected handleOrientationChanged()
    {
        this._logo.setPosition(this.game.canvas.width/2, this.game.canvas.height - this._logo.displayHeight/2);
        //this._background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);
    }
}

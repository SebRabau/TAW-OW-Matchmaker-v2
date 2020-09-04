import { ScaleMode, Size } from "../utils/utils";

export class MainScene extends Phaser.Scene
{
    protected _logo: Phaser.GameObjects.Image;
    protected _background: Phaser.GameObjects.Image;
    protected _inputArea: Phaser.GameObjects.DOMElement;

    constructor()
    {
        super({ key: "MainScene" });
        window.addEventListener("resize", this.handleOrientationChanged.bind(this));
    }

    protected preload(): void
    {
        // load out package
        this.load.pack("preload", "../../assets/manifest.json", "preload");
        this.load.html("inputArea", "../../assets/htmls/inputArea.html");
    }

    protected create(): void
    {
        this._background = this.add.image(this.game.canvas.width/2, 0, "background");
        this._background.setOrigin(0.5, 0);
        this._logo = this.add.image(0, 0, "logo");
        this._logo.setScale(0.5, 0.5);

        this._inputArea = this.add.dom(0, 0).createFromCache("inputArea");
        this._inputArea.setOrigin(0, 0.5);

        this.handleOrientationChanged();
    }

    protected handleOrientationChanged()
    {
        this._logo.setPosition(this.game.canvas.width/2, this.game.canvas.height - this._logo.displayHeight/2);
        this._inputArea.setPosition(this.game.canvas.width * 0.1, this.game.canvas.height * 0.2);
        this._background.setPosition(this.game.canvas.width/2, 0);
        let size = this.calculateSize(
            { w: this._background.width, h: this._background.height },
            { w: this.game.canvas.width, h: this.game.canvas.height },
            ScaleMode.Cover
        );
        this._background.setDisplaySize(size.w, size.h);
    }

    protected calculateSize(from: Size, to: Size, mode: ScaleMode = ScaleMode.Stretch): Size
    {
        let out: Size = { w: 0, h: 0 };
        const ratioH = from.h / from.w;
        const ratioW = from.w / from.h;
        if (mode === ScaleMode.Stretch)
        {
            out.w = to.w;
            out.h = to.h;
        }
        else
        {
            const xSize = from.w;
            const ySize = from.h;

            let useYAxis: boolean;
            switch (mode)
            {
                case ScaleMode.Contain:
                    useYAxis = ySize < xSize;
                    break;

                case ScaleMode.Cover:
                    useYAxis = ySize > xSize;
                    break;
            }

            if (!useYAxis)
            {
                out.h = to.h;
                out.w = out.h * ratioW;
            }
            else
            {
                out.w = to.w;
                out.h = out.w * ratioH;
            }
        }
        return out;
    }
}

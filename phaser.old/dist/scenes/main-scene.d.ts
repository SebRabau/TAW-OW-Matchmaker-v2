import { ScaleMode, Size } from "../utils/utils";
export declare class MainScene extends Phaser.Scene {
    protected _logo: Phaser.GameObjects.Image;
    protected _background: Phaser.GameObjects.Image;
    protected _inputArea: Phaser.GameObjects.DOMElement;
    constructor();
    protected preload(): void;
    protected create(): void;
    protected handleOrientationChanged(): void;
    protected calculateSize(from: Size, to: Size, mode?: ScaleMode): Size;
}
//# sourceMappingURL=main-scene.d.ts.map
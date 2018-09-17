import { Scene } from "phaser";

export default class OverScene extends Scene
{
    constructor()
    {
        super();
        Phaser.Scene.call(this, { key: 'over' });
    }

    preload()
    {
        this.load.image('gameover','assets/gameover.png');
        this.load.bitmapFont('upheaval', 'assets/fonts/upheaval.png', 'assets/fonts/upheaval.fnt');
    }

    create()
    {
        this.add.tileSprite(800, 448, 1600, 896,'gameover');
        this.add.bitmapText(78, 840, 'upheaval', 'You Died! One credit to rechanllenge!');
        this.input.once('pointerdown', function (event) {

            this.scene.start('game');

        }, this);
    }

    update()
    {

    }

}
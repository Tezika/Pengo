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
    }

    create()
    {
        this.add.tileSprite(800, 448, 1600, 896,'gameover');
        this.input.once('pointerdown', function (event) {

            this.scene.start('game');

        }, this);
    }

    update()
    {

    }

}
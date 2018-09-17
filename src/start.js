import { Scene } from "phaser";

export default class StartScene extends Scene
{
    constructor()
    {
        super();
        Phaser.Scene.call(this, { key: 'start' });
    }

    preload()
    {
        this.load.image('startScreen','assets/titleScreen.png');
    }

    create()
    {
        this.add.tileSprite(800, 448, 1600, 896,'startScreen');
        this.input.once('pointerdown', function (event) {

            this.scene.start('game');

        }, this);
    }

    update()
    {

    }

}
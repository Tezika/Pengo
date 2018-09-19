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
        this.load.bitmapFont('upheaval', 'assets/fonts/upheaval.png', 'assets/fonts/upheaval.fnt');
    }

    create()
    {
        this.add.tileSprite(800, 448, 1600, 896,'startScreen');
        this.add.bitmapText(180, 840, 'upheaval', 'Press mouse left button to start!');
        this.input.once('pointerdown', function (event) {
            this.scene.start('game');
        }, this);
        // this.resize();
    }

    update()
    {

    }

    // resize() {
    //     var canvas = document.querySelector("canvas");
    //     var windowWidth = window.innerWidth;
    //     var windowHeight = window.innerHeight;
    //     var windowRatio = windowWidth / windowHeight;
    //     var gameRatio = this.game.config.width / this.game.config.height;
    //     console.log(windowWidth + "   " + windowHeight);
    //     if(windowRatio < gameRatio){
    //         console.log("if");
    //         canvas.style.width = windowWidth + "px";
    //         canvas.style.height = (windowWidth / gameRatio) + "px";
    //     }
    //     else{
    //         windowHeight -= 64;
    //         console.log("else");
    //         canvas.style.width = (windowHeight * gameRatio) + "px";
    //         canvas.style.height = windowHeight + "px";
    //     }
    // }

}
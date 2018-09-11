import 'phaser';
import GameScene from './game.js'


var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    width: 480,
    height: 320,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene:GameScene
};

var game = new Phaser.Game(config);



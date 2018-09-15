import 'phaser';
import GameScene from './game.js'


var config = {
    type: Phaser.WEBGL,
    width: 1600,
    height: 896,
    backgroundColor: '#000000',
    parent: 'phaser-example',
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

//scale the whole things twice(tilemap)
//timer
//put the fire into the corner

//960 x 640



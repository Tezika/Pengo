import 'phaser';
import GameScene from './game.js'


var config = {
    type: Phaser.WEBGL,
    width: 960,
    height: 640,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    width: 960,
    height: 640,
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



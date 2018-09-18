import 'phaser';
import GameScene from './game.js'
import GameScene2 from './level2.js'
import OverScene from './over.js';
import StartScene from './start.js';


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
    scene:[StartScene,GameScene,GameScene2,OverScene],
    audio:{
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);

//scale the whole things twice(tilemap)
//timer
//put the fire into the corner

//960 x 640



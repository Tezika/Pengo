
import 'phaser';
import Boot from './boot.js'


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 480,
    height: 320,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);


function preload()
{
}

function create()
{
}

function update()
{
}




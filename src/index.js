
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
var titlesetName = 'snowWIP';

function preload()
{
     //load the tile
     this.load.tilemapTiledJSON('map', 'assets/tilemap/test.json');
     this.load.image('tiles','assets/tilemap/snowWIP.png');
}

function create()
{
    var map = this.make.tilemap({ key: 'map' });

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    var tiles = map.addTilesetImage(titlesetName, 'tiles');

    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    var layer = map.createStaticLayer('background', tiles, 0, 0);
}

function update()
{
}




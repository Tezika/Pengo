
import 'phaser';


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 480,
    height: 320,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var titlesetName = 'snowWIP';
var blocks;
var player;
var map;
var layer;
var wallLayer;
var lastMoveTime = 0;
var cursors; 

function preload()
{
     //load the tile
     this.load.tilemapTiledJSON('map', 'assets/tilemap/test2.json');
     this.load.image('tiles','assets/tilemap/snowWIP.png');
     this.load.image('player','assets/player.png');
}

function create()
{
    map = this.make.tilemap({ key: 'map' });
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    var tiles = map.addTilesetImage(titlesetName, 'tiles');

    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    layer = map.createStaticLayer('background', tiles);
    wallLayer = map.createDynamicLayer('Walls', tiles);

    wallLayer.setCollision([3,33,38,68]);
    wallLayer.setTileIndexCallback(117, collHandler, this);

    player = this.physics.add.sprite(0, 0, 'player');
    player.x = map.tileToWorldX(1)+16;
    player.y = map.tileToWorldY(1)+16;

    this.physics.add.collider(player, wallLayer);

    //  //  Here we create our coins group
    //  blocks = game.add.group();
    //  blocks.enableBody = true;
 
    //  //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
    //  map.createFromObjects('blocks', 116, null, null);
    
    cursors = this.input.keyboard.createCursorKeys();
}

function collHandler(player, wallLayer)
{
    console.log(player + "   " + wallLayer);
    return true;
}

function update(time, delta)
{
    updatePlayerMovement(time);
}

function updatePlayerMovement (time)
{
    var tw = map.tileWidth * layer.scaleX;
    var th = map.tileHeight * layer.scaleY;
    
    var repeatMoveDelay = 100;

    if (time > lastMoveTime + repeatMoveDelay) {
        if (cursors.down.isDown)
        {
            if (isTileOpenAt(player.x, player.y + th))
            {
                player.y += th;
                lastMoveTime = time;
            }
        }
        else if (cursors.up.isDown)
        {
            if (isTileOpenAt(player.x, player.y - th))
            {
                player.y -= th;
                lastMoveTime = time;
            }
        }

        if (cursors.left.isDown)
        {
            if (isTileOpenAt(player.x - tw, player.y))
            {
                player.x -= tw;
                lastMoveTime = time;
            }
        }
        else if (cursors.right.isDown)
        {
            if (isTileOpenAt(player.x + tw, player.y))
            {
                player.x += tw;
                lastMoveTime = time;
            }
        }
    }
}
function isTileOpenAt (worldX, worldY)
{
    // nonNull = true, don't return null for empty tiles. This means null will be returned only for
    // tiles outside of the bounds of the map.
    var tile = map.getTileAtWorldXY(worldX, worldY, true);

    if (tile && !tile.collides)
    {
        return true;
    }
    else
    {
        return false;
    }
}


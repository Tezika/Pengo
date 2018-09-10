
import 'phaser';
import GameScene from './game.js'


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
    scene:GameScene
};


var game = new Phaser.Game(config);
// var titlesetName = 'snowWIP';

// var blocks;
// var player;
// var map;
// var backgroundLayer;
// var blockLayer;
// var wallLayer;

// var lastMoveTime = 0;
// var cursors; 

// function preload()
// {
//      //load the tile
//      this.load.tilemapTiledJSON('map', 'assets/tilemap/test.json');
//      this.load.image('tiles','assets/tilemap/snowWIP.png');
//      this.load.image('player','assets/player.png');
// }

// function create()
// {
//     map = this.make.tilemap({ key: 'map' });
//     // The first parameter is the name of the tileset in Tiled and the second parameter is the key
//     // of the tileset image used when loading the file in preload.
//     var tiles = map.addTilesetImage(titlesetName, 'tiles');

//     // You can load a layer from the map using the layer name from Tiled, or by using the layer
//     // index (0 in this case).
//     backgroundLayer = map.createDynamicLayer('background', tiles);

//     backgroundLayer.setCollision([2, 4, 33,117]);
 
//     player = this.physics.add.sprite(0, 0, 'player');
//     player.x = map.tileToWorldX(1)+16;
//     player.y = map.tileToWorldY(1)+16;

//     // this.physics.add.collider(player, backgroundLayer);

//     //  //  Here we create our coins group
//     //  blocks = game.add.group();
//     //  blocks.enableBody = true;
 
//     //  //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
//     //  map.createFromObjects('blocks', 116, null, null);
    
//     cursors = this.input.keyboard.createCursorKeys();
// }

// function collHandler(obj1, obj2)
// {
//     console.log(obj1.name + " collide   " + obj2.name);
//     return true;
// }

// function update(time, delta)
// {
//     updatePlayerMovement(time);
//     this.physics.world.collide(player, backgroundLayer, collHandler);
// }

// function updatePlayerMovement (time)
// {
//     var tw = map.tileWidth * backgroundLayer.scaleX;
//     var th = map.tileHeight * backgroundLayer.scaleY;
    
//     var repeatMoveDelay = 100;

//     if (time > lastMoveTime + repeatMoveDelay) {
//         if (cursors.down.isDown)
//         {
//             if (isTileOpenAt(player.x, player.y + th))
//             {
//                 player.y += th;
//                 lastMoveTime = time;
//             }
//         }
//         else if (cursors.up.isDown)
//         {
//             if (isTileOpenAt(player.x, player.y - th))
//             {
//                 player.y -= th;
//                 lastMoveTime = time;
//             }
//         }

//         if (cursors.left.isDown)
//         {
//             if (isTileOpenAt(player.x - tw, player.y))
//             {
//                 player.x -= tw;
//                 lastMoveTime = time;
//             }
//         }
//         else if (cursors.right.isDown)
//         {
//             if (isTileOpenAt(player.x + tw, player.y))
//             {
//                 player.x += tw;
//                 lastMoveTime = time;
//             }
//         }
//     }
// }
// function isTileOpenAt (worldX, worldY)
// {
//     //nonNull = true, don't return null for empty tiles. This means null will be returned only for
//     //tiles outside of the bounds of the map.
//     var tile = map.getTileAtWorldXY(worldX, worldY, true);

//     if (tile && !tile.collides)
//     {
//         return true;
//     }
//     else
//     {
//         return false;
//     }
// }


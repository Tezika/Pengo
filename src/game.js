import 'phaser'
import  Player from './player.js'
import  BlockManager from './blockmanager.js'
import Enemy from './enemy.js';
import EnemyManager from './enemymanager.js';

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        //load the tiles
        this.load.tilemapTiledJSON('map', 'assets/tilemap/test3.json');
        this.load.image('tiles','assets/tilemap/snowWIP.png');
        this.load.image('player','assets/player.jpg');
        this.load.image('block','assets/block.png');
        this.load.image('pengs', 'assets/pengs.png');
        this.titlesetName = 'snowWIP';

        this.load.image('Skull','assets/Skull.png');
        this.load.image('Skull Penguin','assets/Skull Penguin.png');
        this.load.spritesheet('blockSpecial','assets/blockSpecial.png', {frameWidth: 32, frameHeight: 32});

        this.blockManager = new BlockManager(this);
        this.enemyManager = new EnemyManager(this);
    }

    create()
    {
        this.map = this.make.tilemap({ key: 'map' });
        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var tiles = this.map.addTilesetImage(this.titlesetName, 'tiles');

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        this.backgroundLayer = this.map.createDynamicLayer('background', tiles);

        this.tileWidth = this.map.tileWidth * this.backgroundLayer.scaleX;
        this.tileHeight = this.map.tileHeight * this.backgroundLayer.scaleY;
 
        //create the player
        this.player = new Player(this, 1, 1);

        //Blocks' setup 
        this.blockManager.create();
        //Enemy's setup
        this.enemyManager.create();
        this.enemyManager.add(4, 2);
        this.enemyManager.add(3, 2);
        this.enemyManager.add(6, 2);
        this.enemyManager.add(7, 2);
        this.enemyManager.add(3, 8);
        this.enemyManager.add(10, 3);
        
        this.wallSprites = [];
        this.wallParty = false;
        this.wallInc = 0;
        this.partyModeTimer = 0;
        this.partyDuration = 3000;
        this.hsv = Phaser.Display.Color.HSVColorWheel();

        this.map.forEachTile(block => {
            if(block.properties.wall)
            {
                block.index = 154;

                if(Math.random() > .5)
                {
                    var sprite = this.physics.add.sprite(0, 0, "Skull", 0);
                }
                else
                {
                    var sprite = this.physics.add.sprite(0, 0, "Skull Penguin", 0);
                }
                sprite.name = "wall";
                sprite.x = this.map.tileToWorldX(block.x) + 16;
                sprite.y = this.map.tileToWorldY(block.y) + 16;
                sprite.scaleX = .5;
                sprite.scaleY = .5;
                sprite.angle = (Math.random() * 360);
                this.wallSprites.push(sprite);
            }
        });

        this.backgroundLayer.setCollision([154]);

        this.anims.create({
            key: 'specialActive',
            frames: this.anims.generateFrameNumbers('blockSpecial', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update(time, delta)
    {
        this.player.update(time);
        this.blockManager.update(time);
        this.enemyManager.update(time);
        if(this.wallParty)
        {
            if(time > this.partyModeTimer + this.partyDuration)
            {
                this.wallParty = false;
                this.endWallSpritesParty();
            }
            else
            {
                this.wallSpritesParty();
            }
        }
    }

    wallSpritesParty()
    {
        var top = this.hsv[this.wallInc].color;
        var bottom = this.hsv[359 - this.wallInc].color;
        this.wallSprites.forEach(sprite => {
            sprite.setTint(top,top,bottom,bottom);
        });
        
        this.blockManager.blocks.forEach(block => {
            if(block.special)
            {
                block.sprite.setTint(top,top,bottom,bottom);
            }
        });

        this.wallInc+=3;
        if(this.wallInc == 360)
        {
            this.wallInc = 0;
        }
    }

    endWallSpritesParty()
    {
        this.wallInc = 0;
        this.wallSprites.forEach(sprite => {
            sprite.clearTint();
        });
        
        this.blockManager.blocks.forEach(block => {
            if(block.special)
            {
                block.sprite.clearTint();
                block.special = false;
                block.sprite.anims.stopOnRepeat();
            }
        });
    }

    isTileOpenAt (worldX, worldY)
    {
        //nonNull = true, don't return null for empty tiles. This means null will be returned only for
        //tiles outside of the bounds of the map.
        var tile = this.map.getTileAtWorldXY(worldX, worldY, true);
        if (tile && !tile.collides)
        {
            var open = true;
            this.blockManager.blocks.forEach(block => {
                var blockTile = this.map.getTileAtWorldXY(block.sprite.x, block.sprite.y);
                if(blockTile == tile)
                {
                    open = false;
                }
            });

            return open;
        }
        else
        {
            return false;
        }
    }

    getObjAt (worldX, worldY)
    {
        for(var i = 0; i < this.blockManager.blocks.length; i++)
        {
            if(worldX == this.blockManager.blocks[i].sprite.x && worldY == this.blockManager.blocks[i].sprite.y)
            {
                return this.blockManager.blocks[i];
            }
        }

        for(var i = 0; i < this.wallSprites.length; i++)
        {
            if(worldX == this.wallSprites[i].x && worldY == this.wallSprites[i].y)
            {
                return this.wallSprites[i];
            }
        }

        for(var i = 0; i < this.enemyManager.enemies.length; i++)
        {
            if(worldX == this.enemyManager.enemies[i].sprite.x && worldY == this.enemyManager.enemies[i].sprite.y)
            {
                return this.enemyManager.enemies[i];
            }
        }
    }

    isEnemyAt(worldX, worldY)
    {
        var isEnemyHere = false;
        this.enemyManager.enemies.forEach(enemy => {
            if(enemy.sprite.x >= worldX && enemy.sprite.x <= worldX+30 && enemy.sprite.y >= worldY && enemy.sprite.y <= worldY+30 )
            {
                isEnemyHere = true;
            }
        });
        return isEnemyHere;
    }
}
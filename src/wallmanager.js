import 'phaser'
import Block from './block';
import { Scene } from "phaser";
import { Constant } from './game';

export default class WallManager 
{
    constructor(scene)
    {
        this.scene = scene;
        this.preload();
    }
    
    preload()
    {
        
    }

    create()
    {
        this.wallSprites = [];
        this.wallParty = false;
        this.wallInc = 0;
        this.partyModeTimer = 0;
        this.partyDuration = 3000;
        this.hsv = Phaser.Display.Color.HSVColorWheel();

        this.scene.map.forEachTile(block => {
            if(block.properties.wall)
            {
                block.index = 154;

                if(Math.random() > .5)
                {
                    var sprite = this.scene.physics.add.sprite(0, 0, "Skull", 0);
                }
                else
                {
                    var sprite = this.scene.physics.add.sprite(0, 0, "Skull Penguin", 0);
                }
                sprite.name = "wall";
                sprite.x = this.scene.map.tileToWorldX(block.x) + Constant.Tile_Size/2;
                sprite.y = this.scene.map.tileToWorldY(block.y) + Constant.Tile_Size/2;
                sprite.angle = (Math.random() * 360);
                this.wallSprites.push(sprite);
            }
        });
    }

    update(time)
    {
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
        
        this.scene.blockManager.blocks.forEach(block => {
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
        
        this.scene.blockManager.blocks.forEach(block => {
            if(block.special)
            {
                block.sprite.clearTint();
                block.special = false;
                block.sprite.anims.stopOnRepeat();
            }
        });
    }
}
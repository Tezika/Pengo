import 'phaser'
import Block from './block';
import { Scene } from "phaser";
import { Constant } from './game';

export default class BlockManager 
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
        this.blocks = [];
        //var blockSprite = this.scene.map.createFromObjects('blocks', 'block', {key:'player'}, this);
        this.scene.map.forEachTile(block => {
            if(block.properties.block)
            {
                block.index = Constant.Empty_Tile_Index;
                this.blocks.push(new Block(this.scene, block));
            }
        });
    }

    update(time)
    {
        this.blocks.forEach(block => {
            block.update(time);
        });
    }

    remove(block) {
        const index = this.blocks.indexOf(block);
        this.blocks.splice(index, 1);
    }
    
    getBlockAt(worldX, worldY)
    {
        for(var i = 0; i < this.scene.blockManager.blocks.length; i++)
        {
            if(worldX == this.scene.blockManager.blocks[i].sprite.x && worldY == this.scene.blockManager.blocks[i].sprite.y)
            {
                return this.scene.blockManager.blocks[i];
            }
        }
    }
}
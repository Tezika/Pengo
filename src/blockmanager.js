import 'phaser'
import Block from './block';
import { Scene } from "phaser";

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
                block.index = 36;
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
}
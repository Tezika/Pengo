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
        var blockSprite = this.scene.map.createFromObjects('blocks', 'block', {key:'player'}, this);
        blockSprite.forEach(block => {
          
            var tile = this.scene.map.getTileAtWorldXY(block.x, block.y);
            tile.setCollision(true, true, true, true);
            this.blocks.push(new Block(this.scene, block));
        });
    }
}
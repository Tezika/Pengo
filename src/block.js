import { Scene } from "phaser";

export default class Block 
{
    constructor(scene, tile)
    {
        this.scene = scene;
          //add the block to the game scene's physics management.
        this.sprite = this.scene.physics.add.sprite(0, 0, "block", 0);
        this.sprite.x = this.scene.map.tileToWorldX(tile.x)+16;
        this.sprite.y= this.scene.map.tileToWorldY(tile.y)+16;
        //this.scene.physics.add.overlap(this.sprite, this.scene.backgroundLayer, this.colCallback);
    }

    colCallback(obj1, obj2)
    {
        console.log("hehehe");
    }
}
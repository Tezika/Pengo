import { Scene } from "phaser";

export default class Block 
{
    constructor(scene, sprite)
    {
        this.scene = scene;
          //add the block to the game scene's physics management.
        this.sprite = this.scene.physics.add.sprite(sprite);
        this.scene.physics.add.overlap(this.sprite, this.scene.backgroundLayer, this.colCallback);
    }

    colCallback()
    {
        console.log(callback);
    }
}
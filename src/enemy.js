
import 'phaser';

export default class Enemy
{
    constructor(scene,x,y)
    {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, "pengs", 0);
        this.sprite.scaleX = .5;
        this.sprite.scaleY = .5;
        this.sprite.x = this.scene.map.tileToWorldX(3)+16;
        this.sprite.y= this.scene.map.tileToWorldY(2)+16;
    }

    update(time)
    {

    }
}
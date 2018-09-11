
import 'phaser';
import { Direction } from './block';

export default class Enemy
{
    constructor(scene, tileX, tileY)
    {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(0, 0, "pengs", 0);
        this.sprite.scaleX = .5;
        this.sprite.scaleY = .5;
        this.sprite.x = this.scene.map.tileToWorldX(tileX)+16;
        this.sprite.y= this.scene.map.tileToWorldY(tileY)+16;

        //Push stuff
        this.pushing = false;
        this.pushingSpeed = 10;
        this.pushDir = Direction.Left;
        this.pusher  = null;
    }

    update(time)
    {
        if(this.pushing)
        {
            console.log("This enemy has been pushing now.");
            switch(this.pushDir)
            {
                case Direction.Up:
                    this.sprite.y = this.pusher.sprite.y - this.scene.tileHeight;
                    break;
                case Direction.Down:
                    this.sprite.y = this.pusher.sprite.y + this.scene.tileHeight;
                    break;
                case Direction.Left:
                    this.sprite.x = this.pusher.sprite.x - this.scene.tileWidth;
                    break;
                case Direction.Right:
                    this.sprite.x = this.pusher.sprite.x + this.scene.tileWidth;
                    break;
                default:
                    break;
            }
            //when the enemy died.
            if(!this.scene.isTileOpenAt(this.sprite.x, this.sprite.y))
            {
                this.destroy();
            }
        }
        else
        {
            
        }
    }

    destroy()
    {
        this.scene.enemyManager.remove(this);
        this.sprite.destroy();
    }
}
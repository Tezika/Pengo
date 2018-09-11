import 'phaser'

export default class Player
{
    constructor(scene, x, y)
    {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, "player", 0);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.scene.physics.add.collider(this.sprite, this.backgroundLayer);
        this.lastMoveTime = 0;
        this.lastPushTime = 0;
    }

    update(time)
    {
        this.pushBlock(time);
        this.updateMovement(time);
    }

    updateMovement(time)
    {
        var tw = this.scene.tileWidth;
        var th = this.scene.tileHeight;
        
        var repeatMoveDelay = 100;
    
        if (time > this.lastMoveTime + repeatMoveDelay) 
        {
            if (this.cursors.down.isDown)
            {
                if (this.scene.isTileOpenAt(this.sprite.x, this.sprite.y + th))
                {
                    this.sprite.y += th;
                    this.lastMoveTime = time;
                }
            }
            else if (this.cursors.up.isDown)
            {
                if (this.scene.isTileOpenAt(this.sprite.x, this.sprite.y - th))
                {
                    this.sprite.y -= th;
                    this.lastMoveTime = time;
                }
            }
    
            if (this.cursors.left.isDown)
            {
                if (this.scene.isTileOpenAt(this.sprite.x - tw, this.sprite.y))
                {
                    this.sprite.x -= tw;
                    this.lastMoveTime = time;
                }
            }
            else if (this.cursors.right.isDown)
            {
                if (this.scene.isTileOpenAt(this.sprite.x + tw, this.sprite.y))
                {
                    this.sprite.x += tw;
                    this.lastMoveTime = time;
                }
            }
        }
    }

    pushBlock(time)
    {
        var repeatPushDelay = 100;
        if (time > this.lastPushTime + repeatPushDelay) 
        {
            this.lastPushTime = time;

        }
    }
}
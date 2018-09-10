import 'phaser'

export default class Player
{
    constructor(scene, x, y)
    {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, "player", 0);
        this.sprite.scaleX = .5;
        this.sprite.scaleY = .5;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.scene.physics.add.collider(this.sprite, this.backgroundLayer);
        this.lastMoveTime = 0;
    }

    update(time)
    {
        this.updateMovement(time);
    }

    updateMovement(time)
    {
        var tw = this.scene.map.tileWidth * this.scene.backgroundLayer.scaleX;
        var th = this.scene.map.tileHeight * this.scene.backgroundLayer.scaleY;
        
        var repeatMoveDelay = 100;
    
        if (time > this.lastMoveTime + repeatMoveDelay) {
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
}
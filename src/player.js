import 'phaser'

export default class Player
{
    constructor(scene, x, y)
    {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, "player", 0);
        this.sprite.scaleX = .5;
        this.sprite.scaleY = .5;
        this.sprite.x = this.scene.map.tileToWorldX(1)+16;
        this.sprite.y= this.scene.map.tileToWorldY(1)+16;

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.scene.physics.add.collider(this.sprite, this.backgroundLayer);
        this.lastMoveTime = 0;

        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
                this.sprite.angle = 90;
                if (this.scene.isTileOpenAt(this.sprite.x, this.sprite.y + th))
                {
                    this.sprite.y += th;
                    this.lastMoveTime = time;
                }
            }
            else if (this.cursors.up.isDown)
            {
                this.sprite.angle = 270;
                if (this.scene.isTileOpenAt(this.sprite.x, this.sprite.y - th))
                {
                    this.sprite.y -= th;
                    this.lastMoveTime = time;
                }
            }
            
            if (this.cursors.left.isDown)
            {
                this.sprite.angle = 180;
                if (this.scene.isTileOpenAt(this.sprite.x - tw, this.sprite.y))
                {
                    this.sprite.x -= tw;
                    this.lastMoveTime = time;
                }
            }
            else if (this.cursors.right.isDown)
            {
                this.sprite.angle = 0;
                if (this.scene.isTileOpenAt(this.sprite.x + tw, this.sprite.y))
                {
                    this.sprite.x += tw;
                    this.lastMoveTime = time;
                }
            }
        }
        
        if (this.spaceBar.isDown)
        {
            var xmov = tw;
            var ymov = th;
            switch(this.sprite.angle)
            {
                case 0: //right
                    ymov = 0;
                    break;
                case 90: //down
                    xmov = 0;
                    break;
                case -180: //left
                    xmov = -xmov;
                    ymov = 0;
                    break;
                case -90: //up
                    xmov = 0;
                    ymov = -ymov;
                    break;
            }
            
            if (!this.scene.isTileOpenAt(this.sprite.x + xmov, this.sprite.y + ymov))
            {
                this.scene.blockManager.blocks.forEach(block => {
                    if(this.sprite.x + xmov == block.sprite.x && this.sprite.y + ymov == block.sprite.y)
                    {
                        while(this.scene.isTileOpenAt(block.sprite.x + xmov, block.sprite.y + ymov))
                        {
                            block.sprite.x += xmov;
                            block.sprite.y += ymov;
                        }
                    }
                });
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
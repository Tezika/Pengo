import { Constant } from "./game";

export default class UIManager
{
    constructor(scene, x, y)
    {
        this.liveSprites = [];
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.lifeCount = Constant.Player_Lifes;
    }

    create()
    {
        this.lifeBg = this.scene.add.image(this.x, this.y,'livesBg');
        this.updateLives();
    }


    updateLives()
    {
        //remove all sprites firstly
        if(this.liveSprites.length != 0)
        {
            for(var i = 0; i < this.lifeCount; i++)
            {
                 this.liveSprites[i].destroy();
            } 
        }
        this.liveSprites = [];
        //update the life count;
        this.lifeCount = this.scene.player.lives;
        this.lifePosX = this.lifeBg.x - this.lifeBg.width/2 + Constant.Tile_Size/4;
        for(var i = 0; i < this.lifeCount; i++)
        {
            var uiElement = this.scene.add.sprite(this.lifePosX, this.lifeBg.y, 'downPlayer', 0);
            uiElement.scaleX =  .4;
            uiElement.scaleY =  .4;
            this.lifePosX += this.lifeBg.width/Constant.Player_Lifes;
            this.liveSprites.push(uiElement);
        }
    }
}
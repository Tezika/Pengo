export default class ScoreManager 
{
    
    constructor(scene)
    {
        this.scene = scene;
        this.score = 0;
    }

    add(score)
    {
        this.score += score;
    }
}
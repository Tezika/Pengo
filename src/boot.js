var titlesetName = 'snowWIP';

class Boot
{
    preload()
    {
        //load the tile
        this.load.tilemapTiledJSON('map', 'assets/tilemap/test.json');
        this.load.image('tiles','assets/tilemap/snowWIP.png');
    }

    create()
    {
        var map = this.make.tilemap({ key: 'map' });

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var tiles = map.addTilesetImage(titlesetName, 'tiles');
    
        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        var layer = map.createStaticLayer('background', tiles, 0, 0);
    }

    update()
    {

    }
}

export default Boot;
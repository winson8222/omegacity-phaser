import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('Interior', 'tiles/interior.png')
        this.load.image('modern', 'tiles/modern.png')
        this.load.tilemapTiledJSON('user_room', 'tiles/modern_tilemap.json')

        //load character
        this.load.atlas('faune', 'character/faune.png', 'character/faune.json')
    }

    create() {
        this.scene.start('game')
    }
}
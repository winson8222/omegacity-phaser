import Phaser from 'phaser'
import {debugDraw} from '../utils/debug'


export default class Game extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys //trust that this will exist with the !
    private faune!: Phaser.Physics.Arcade.Sprite
	constructor()
	{
		super('game')
	}

preload()
{
   //create arrow and spacebar
   this.cursors = this.input.keyboard.createCursorKeys()
}
create()
{
    const map = this.make.tilemap({ key: 'user_room' })
    const tileSetInterior = map.addTilesetImage('Interior', 'Interior') //tile set name and image key
    const tileSetModern = map.addTilesetImage('modern', 'modern') //tile set name and image key

    map.createLayer('Floor', tileSetModern) //the tutorial uses staticlayer
    const wall_layer = map.createLayer('Walls', tileSetModern)
    wall_layer.setCollisionByProperty({ collides: true })
    

    const interior_layer = map.createLayer('Interior', tileSetInterior)
    interior_layer.setCollisionByProperty({ collides: true })

        // debugDraw(wall_layer, this)

        this.faune = this.physics.add.sprite(120, 120, 'faune', 'walk-down-3.png')
        //all animations are global once we add them
        //set the body size of the sprite for collision handling
        this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8)

        this.anims.create({
            key: 'faune-idle-down',
            frames: [{ key: 'faune', frame: 'walk-down-3.png' }]
        })
        
        //genereate an rray of all the frames automatically instead of writing out manually.
        this.anims.create({
            key: 'faune-walk-down',
            frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'walk-down-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15, //animation frame rate, not the game's 
            duration: 2000 //animation duration
        })

        this.anims.create({
            key: 'faune-walk-up',
            frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'walk-up-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15, //animation frame rate, not the game's 
            duration: 2000 //animation duration
        })

        this.anims.create({
            key: 'faune-walk-side',
            frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'walk-side-', suffix: '.png' }),
            repeat: -1,
            frameRate: 15, //animation frame rate, not the game's 
            duration: 2000 //animation duration
        })

        //initiate idle
        this.anims.create({
            key: 'faune-idle-up',
            frames: [{ key: 'faune', frame: 'walk-up-3.png' }]
        })

        this.anims.create({
            key: 'faune-idle-up',
            frames: [{ key: 'faune', frame: 'walk-down-3.png' }]
        })

        this.anims.create({
            key: 'faune-idle-side',
            frames: [{ key: 'faune', frame: 'walk-side-3.png' }]
        })

        this.faune.anims.play('faune-idle-down')

        this.physics.add.collider(this.faune, wall_layer)

        this.cameras.main.startFollow(this.faune, true)
        this.cameras.main.centerOn(0, 0);
    }

    update(t: number, dt: number)
    {
        if (!this.cursors || !this.faune)   return
        
        const speed = 100

        if (this.cursors.left?.isDown)
        {
            this.faune.anims.play('faune-walk-side', true)
            this.faune.setVelocity(-speed, 0)
            this.faune.scaleX = -1
            this.faune.body.offset.x = 24
        }
        else if (this.cursors.right?.isDown)
        {
            this.faune.anims.play('faune-walk-side', true)
            this.faune.setVelocity(speed, 0)
            this.faune.scaleX = 1
            this.faune.body.offset.x = 8
        } else if (this.cursors.up?.isDown)
        {
            this.faune.anims.play('faune-walk-up', true)
            this.faune.setVelocity(0, -speed)
        } else if (this.cursors.down?.isDown)
        {
            this.faune.anims.play('faune-walk-down', true)
            this.faune.setVelocity(0, speed)
        } else {
            const parts = this.faune.anims.currentAnim.key.split("-")
            parts[1] = 'idle' //keep the direction
            this.faune.anims.play((parts).join("-"), true)
            this.faune.setVelocity(0, 0)
        }
    } //dt is the change since last frame
}

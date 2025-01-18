import { MovableObjects } from "./movableObjects.class";

export class Pufferfish extends MovableObjects {

    enemySprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.width = 200;
        this.height = 150;
        this.offsetX = 10;
        this.offsetY = 0;
        this.posY = 720 / (Math.random() * 2);
        this.posX = 800;
        console.log(this.posY);
    }

    preload() {
        this.loadImages(5, 'pufferfish_swim', 'assets/enemies/pufferfish/swim/green/');
        this.loadImages(3, 'pufferfish_death', 'assets/enemies/pufferfish/die/green/');
    }
    
    create() {
        this.enemySprite = this.scene.physics.add
            .sprite(this.posX, this.posY, 'pufferfish_swim1')
            .setScale(0.5);
        this.enemySprite.setBounce(0.0);
        this.enemySprite.setCollideWorldBounds(true);
        this.enemySprite.body.setSize(this.width, this.height);
        this.enemySprite.body.setOffset(this.offsetX, this.offsetY);
        this.loadAnimations();
    }

    update() {
        this.manageEnemy();
    }

    manageEnemy() {
        if (!this.isDead) {
            this.idle(this.enemySprite, 'pufferfish_swim_anim');
        }
    }

    loadAnimations() {
        this.scene.anims.create({
            key: 'pufferfish_swim_anim',
            frames: this.getSpriteImages('pufferfish_swim', 5),
            frameRate: 6,
            repeat: -1,
        });

        this.scene.anims.create({
            key: 'pufferfish_death_anim',
            frames: this.getSpriteImages('pufferfish_death', 3),
            frameRate: 6,
            repeat: -1,
        });
    }



}
import { GlobalstateserviceService } from "../services/globalstate.service";
import { MovableObjects } from "./movableObjects.class";

export class Pufferfish extends MovableObjects {

    enemySprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    isAggro: boolean = false;
    hasAggro: boolean = false;
    constructor(scene: Phaser.Scene, globalStates: GlobalstateserviceService, posX: number) {
        super(scene, globalStates);
        this.width = 200;
        this.height = 150;
        this.offsetX = 10;
        this.offsetY = 0;
        this.posY = 720 / (Math.random() * 2);
        this.posX = posX;
        this.speed = -10;
    }

    preload() {
        this.loadImages(5, 'pufferfish_swim', 'assets/enemies/pufferfish/swim/green/');
        this.loadImages(3, 'pufferfish_death', 'assets/enemies/pufferfish/die/green/');
        this.loadImages(5, 'pufferfish_aggro_trans', 'assets/enemies/pufferfish/aggro_transition/green/');
        this.loadImages(5, 'pufferfish_aggro_swim', 'assets/enemies/pufferfish/aggro_swim/green/');
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
        if (!this.isDead && !this.isAggro) {
            this.moveX(this.enemySprite, this.speed, 'pufferfish_swim_anim', false);
        } else if (!this.isDead && this.isAggro && this.hasAggro) {
            this.moveX(this.enemySprite, this.speed, 'pufferfish_aggro_anim', false);
        }
    }

    checkAggroState() {
        if (!this.hasAggro) {
            console.log('pufferfish is checking aggro state');
            this.enemySprite.anims.play('pufferfish_aggro_trans_anim').once('animationcomplete', () => {	
               this.speed = -150;
               this.hasAggro = true;
                console.log('aggro transition complete');
            });
    }}

    checkDeathState() {
        if (this.isDead) {
            this.enemySprite.anims.play('pufferfish_death_anim').once('animationcomplete', () => {
                console.log('pufferfish is dead');
                this.hasDied = true;
                this.globalStates.hasSlapped.set(false);
            });

        }
    }

    loadAnimations() {
        if (!this.scene.anims.exists(('pufferfish_swim_anim'))) {
            this.scene.anims.create({
                key: 'pufferfish_swim_anim',
                frames: this.getSpriteImages('pufferfish_swim', 5),
                frameRate: 6,
                repeat: -1,
            });
        }
        if (!this.scene.anims.exists(('pufferfish_death_anim'))) {
            this.scene.anims.create({
                key: 'pufferfish_death_anim',
                frames: this.getSpriteImages('pufferfish_death', 3),
                frameRate: 6,
                repeat: 0,
            }); 
        }
        if (!this.scene.anims.exists(('pufferfish_aggro_trans_anim'))) {
            this.scene.anims.create({
                key: 'pufferfish_aggro_trans_anim',
                frames: this.getSpriteImages('pufferfish_aggro_trans', 5),
                frameRate: 6,
                repeat: 0, // weil soll aj nur einmal abgespielt werden 
            })
        }
        if (!this.scene.anims.exists(('pufferfish_aggro_anim'))) {
            this.scene.anims.create({
                key: 'pufferfish_aggro_anim',
                frames: this.getSpriteImages('pufferfish_aggro_swim', 5),
                frameRate: 6,
                repeat: -1,
            })
        }
        

        

        
    }



}
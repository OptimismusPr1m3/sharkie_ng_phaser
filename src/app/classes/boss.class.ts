import { GlobalstateserviceService } from '../services/globalstate.service';
import { MovableObjects } from './movableObjects.class';

export class Boss extends MovableObjects {
  isHurted: boolean = false;
  isSpawning: boolean = false;
  hasSpawned: boolean = false;
  bossSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(scene: Phaser.Scene, globalStates: GlobalstateserviceService) {
    super(scene, globalStates);
    this.width = 900;
    this.height = 500;
    this.offsetX = 50;
    this.offsetY = 500;
    this.posY = this.randomizePosition(400, 600);
    this.posX = this.randomizePosition(4260, 6200);
  }

  preload() {
    this.loadImages(13, 'boss_idle', 'assets/boss/idle/');
    this.loadImages(4, 'boss_hurt', 'assets/boss/hurt/');
    this.loadImages(6, 'boss_dead', 'assets/boss/dead/');
    this.loadImages(6, 'boss_attacking', 'assets/boss/attacking/');
    this.loadImages(10, 'boss_spawn', 'assets/boss/spawn/');
  }

  create() {
    this.bossSprite = this.scene.physics.add
      .sprite(this.posX, this.posY, 'boss_spawn1')
      .setScale(0.6);
    this.bossSprite.setBounce(0.0);
    this.bossSprite.setCollideWorldBounds(true);
    this.bossSprite.body.setSize(this.width, this.height);
    this.bossSprite.body.setOffset(this.offsetX, this.offsetY);
    this.loadAnimations();
  }

  update(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.manageBoss(player);
    this.checkHealth();
    //this.scene.physics.moveToObject(this.bossSprite, player, 100)
  }

  manageBoss(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    if (!this.isDead && !this.isAttacking && !this.isHurted && !this.isSpawning && this.hasSpawned) {
      this.moveBoss(100, player)
      console.log('Boss is moving');
    } else if (this.isHurted) {
      this.bossHurt();
      console.log('Boss is hurted');
    } else if (this.isDead && !this.hasDied && !this.isSpawning) {
      this.bossDeath();
      console.log('Boss is dead');
    } else if (this.isSpawning && !this.hasSpawned) {
      this.bossSpawn();
      console.log('Boss is spawning');
    } else if (this.isAttacking && !this.isHurted && !this.isDead) {
      this.bossAttack();
      console.log('Boss is attacking');
    }
  }

  moveBoss(speed: number = 100, player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    if (this.scene.physics.overlap(this.bossSprite, player)) return; // provokes bug , so that boss is swimming in last direction till the hitboxes dont touch each other, after that boss is moving again to player (nice bug which is totally nice lol)
    this.bossSprite.anims.play('boss_idle_anim', true);
    this.scene.physics.moveToObject(this.bossSprite, player, speed);
    this.checkDirection(player);
  }

  checkDirection(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    if (this.bossSprite.x > player.x) {
      this.bossSprite.flipX = false;
    } else {
      this.bossSprite.flipX = true
    }
  }

  checkHealth() {
    if (this.healthPoints <= 0) {
      this.isDead = true;
    }
  }

  bossAttack() {
    this.bossSprite.setVelocity(0);
    this.bossSprite.anims.play('boss_attacking_anim', true).once('animationcomplete', () => {
      this.isAttacking = false;
      this.idle(this.bossSprite ,'boss_idle_anim');
    });
  }

  bossHurt() {
    this.bossSprite.anims
      .play('boss_hurt_anim', true)
      .once('animationcomplete', () => {
        console.log('Boss health: ', this.healthPoints);
        this.isHurted = false;
      });
  }

  bossDeath() {
    this.bossSprite.setVelocity(0);
    this.bossSprite.anims
      .play('boss_dead_anim', true)
      .once('animationcomplete', () => {
        this.hasDied = true; 
      });
  }

  bossSpawn() {
    this.bossSprite.anims
      .play('boss_spawn_anim', true)
      .once('animationcomplete', () => {
        this.hasSpawned = true;
        this.isSpawning = false;
      });
  }

  loadAnimations() {
    if (!this.scene.anims.exists('boss_idle_anim')) {
      this.scene.anims.create({
        key: 'boss_idle_anim',
        frames: this.getSpriteImages('boss_idle', 13),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (!this.scene.anims.exists('boss_hurt_anim')) {
      this.scene.anims.create({
        key: 'boss_hurt_anim',
        frames: this.getSpriteImages('boss_hurt', 4),
        frameRate: 8,
        repeat: 0,
      });
    }
    if (!this.scene.anims.exists('boss_dead_anim')) {
      this.scene.anims.create({
        key: 'boss_dead_anim',
        frames: this.getSpriteImages('boss_dead', 6),
        frameRate: 8,
        repeat: 0,
      });
    }
    if (!this.scene.anims.exists('boss_attacking_anim')) {
      this.scene.anims.create({
        key: 'boss_attacking_anim',
        frames: this.getSpriteImages('boss_attacking', 6),
        frameRate: 8,
        repeat: 0,
      });
    }
    if (!this.scene.anims.exists('boss_spawn_anim')) {
      this.scene.anims.create({
        key: 'boss_spawn_anim',
        frames: this.getSpriteImages('boss_spawn', 10),
        frameRate: 8,
        repeat: 0,
      });  
    }
  }
}

import Phaser from 'phaser';
import { Background } from '../classes/background.class';
import { Player } from '../classes/player.class';
import { Jellyfish } from '../classes/jellyfish.class';
import { GlobalstateserviceService } from '../services/globalstate.service';
import { Pufferfish } from '../classes/pufferfish.class';

export class Gamescene extends Phaser.Scene {

  private background!: Background;
  private player!: Player;
  private enemies: Jellyfish[] | Pufferfish[] = [];

  constructor(public globalStateService: GlobalstateserviceService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this);
    this.player = new Player(this, globalStateService);
    this.enemies = [
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
      new Jellyfish(this, globalStateService),
      new Pufferfish(this, globalStateService),
      new Pufferfish(this, globalStateService),
      new Pufferfish(this, globalStateService),
    ];
  }

  preload() {
    this.background.preload();
    //this.loadEnemies();
    this.enemies[0].preload();
    this.enemies[3].preload();
    this.player.preload();
  }

  loadEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.preload();
    });
  }

  createEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.create();
    });
  }

  updateEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
  }

  create() {
    this.physics.world.setBounds(0, 0, 1920 * 2, 1080);
    this.background.create();
    this.createEnemies();
    this.player.create();
    this.cameras.main.startFollow(this.player.playerSprite, true, 0.1, 0.1);
    this.cameras.main.setBounds(0,0, 1920 * 2, 1080);
  }

  override update() {
    this.player.update();
    this.updateEnemies();
    this.checkCollisions();
    this.garbageCollection();
  }

  checkCollisions() {
    this.enemies.forEach((enemy: Jellyfish | Pufferfish) => {
      if (this.physics.overlap(this.player.playerSprite, enemy.enemySprite)) {
        console.log('collision');
      }
      if (enemy instanceof Pufferfish) {
        this.checkPufferfishProximity(enemy) 
        this.checkSlapCollision(enemy)
      }
    });
    //this.poisonedBubbleCollisionCheck();
    this.whiteBubbleCollisionCheck();
  }

  checkPufferfishProximity(enemy: Pufferfish) {
    if (enemy.isAggro)
      return;

    const distance = Phaser.Math.Distance.Between(
      this.player.playerSprite.x,
      this.player.playerSprite.y,
      enemy.enemySprite.x,
      enemy.enemySprite.y
    )
    if (distance < 400) {
      enemy.isAggro = true;
      enemy.checkAggroState();
    }
  }

  checkSlapCollision(enemy: Pufferfish) {
    if (enemy.isDead) 
      return;
  
    const distance = Phaser.Math.Distance.Between(
      this.player.playerSprite.x,
      this.player.playerSprite.y,
      enemy.enemySprite.x,
      enemy.enemySprite.y
    )
    if (distance < 320 && this.globalStateService.hasSlapped()) {
      enemy.isDead = true;
      enemy.enemySprite.setVelocityX(0)
      enemy.checkDeathState();
    } else {
      this.globalStateService.hasSlapped.set(false);
    }
  }

  garbageCollection() {
    this.enemies.forEach((enemy) => {
      if (enemy.hasDied) {
        enemy.enemySprite.destroy();
      }
    });
  }
  

  poisonedBubbleCollisionCheck() {
    const bubbles = this.player.getPBubbles();
    bubbles.forEach((bubble) => {
      this.enemies.forEach((enemy: Jellyfish) => {
        if (this.physics.overlap(bubble, enemy.enemySprite)) {
          this.globalStateService.removePBubble(bubble); 
          bubble.destroy();
          enemy.isDead = true;
          enemy.enemySprite.destroy();
        }
      });
    });
  }

  whiteBubbleCollisionCheck() {
    const bubbles = this.player.getWBubbles();
    bubbles.forEach((bubble) => {
      this.enemies.forEach((enemy: Jellyfish) => {
        if (enemy instanceof Jellyfish && this.physics.overlap(bubble, enemy.enemySprite)) {
          this.globalStateService.removeWBubble(bubble);
          bubble.destroy();
          enemy.isDead = true;
          enemy.enemySprite.destroy();
        }
      });
    });
  }

}

import Phaser from 'phaser';
import { Background } from '../classes/background.class';
import { Player } from '../classes/player.class';
import { Jellyfish } from '../classes/jellyfish.class';
import { GlobalstateserviceService } from '../services/globalstate.service';

export class Gamescene extends Phaser.Scene {
  private background!: Background;
  private player!: Player;
  //private enemy_0!: Jellyfish;
  private enemies: any[] = [];

  constructor(public globalStateService: GlobalstateserviceService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this);
    this.player = new Player(this, globalStateService);
    this.enemies = [
      new Jellyfish(this),
      new Jellyfish(this),
      new Jellyfish(this),
    ];
  }

  preload() {
    this.background.preload();
    //this.loadEnemies();
    this.enemies[0].preload();
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
    this.background.create();
    //this.enemy_0.create()
    this.createEnemies();
    this.player.create();
  }

  override update() {
    this.player.update();
    //this.enemy_0.update()
    this.updateEnemies();
    this.checkCollisions();
  }

  checkCollisions() {
    this.enemies.forEach((enemy: Jellyfish) => {
      if (this.physics.overlap(this.player.playerSprite, enemy.enemySprite)) {
        console.log('collision');
      }
    });
    //this.poisonedBubbleCollisionCheck();
    this.whiteBubbleCollisionCheck();
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
        if (this.physics.overlap(bubble, enemy.enemySprite)) {
          this.globalStateService.removeWBubble(bubble);
          bubble.destroy();
          enemy.isDead = true;
          enemy.enemySprite.destroy();
        }
      });
    });
  }

}

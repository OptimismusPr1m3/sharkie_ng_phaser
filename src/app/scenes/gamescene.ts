import Phaser from 'phaser';
import { Background } from '../classes/background.class';
import { GlobalvariablesService } from '../services/globalvariables.service';
import { Player } from '../classes/player.class';
import { Jellyfish } from '../classes/jellyfish.class';

export class Gamescene extends Phaser.Scene {

  private background!: Background;
  private player!: Player;
  private enemy_0!: Jellyfish;
  private enemies: any[] = [];

  constructor(public globals: GlobalvariablesService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this)
    //this.enemy_0 = new Jellyfish(this)
    this.player = new Player(this)
    this.enemies = [new Jellyfish(this), new Jellyfish(this), new Jellyfish(this)]
  }

  preload() {
    this.background.preload();
    //this.enemy_0.preload();
    this.loadEnemies()
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
    this.background.create()
    //this.enemy_0.create()
    this.createEnemies()
    this.player.create()
  }

  override update() {
    this.player.update()
    //this.enemy_0.update()
    this.updateEnemies()
    //this.checkCollisions()
  }

  checkCollisions() { 
    if (this.physics.overlap(this.player.playerSprite, this.enemy_0.enemySprite)) {
      console.log('collision');
  }
}
  
}

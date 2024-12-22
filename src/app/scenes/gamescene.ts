import Phaser from 'phaser';
import { Background } from '../classes/background.class';
import { GlobalvariablesService } from '../services/globalvariables.service';
import { Player } from '../classes/player.class';

export class Gamescene extends Phaser.Scene {

  private background!: Background;
  private player!: Player;

  constructor(public globals: GlobalvariablesService) {
    super({ key: 'Gamescene' });
    this.background = new Background(this)
    this.player = new Player(this)
  }

  preload() {
    this.background.preload();
    this.player.preload();
  }


  create() {
    this.background.create()
    this.player.create()
  }

  
}

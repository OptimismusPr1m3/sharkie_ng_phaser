import Phaser from 'phaser';
import { StaticObjects } from './staticObjects.class';

export class Background extends StaticObjects {
  
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  preload() {
    this.scene.load.image('bg1', 'assets/background/layers/floor/L1.png');
    this.scene.load.image('bg2', 'assets/background/layers/floor/L2.png');
    this.scene.load.image('bg3', 'assets/background/layers/fondo1/L1.png');
    this.scene.load.image('bg4', 'assets/background/layers/fondo1/L2.png');
    this.scene.load.image('water', 'assets/background/layers/water/L2.png');
  }

  create() {
    this.scene.add.image(this.imageCenter, 1080 / 2, 'water');
    this.scene.add.image(this.imageCenter, 1080 / 2.2, 'bg3');
    this.scene.add.image(this.imageCenter, 1080 / 2, 'bg1');

    this.scene.add.image(this.imageCenter * 3, 1080 / 2, 'water');
    this.scene.add.image(this.imageCenter * 3, 1080 / 2.2, 'bg4');
    this.scene.add.image(this.imageCenter * 3, 1080 / 2, 'bg2');
  }
}

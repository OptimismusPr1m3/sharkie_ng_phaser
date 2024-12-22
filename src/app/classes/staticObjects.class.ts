import Phaser from 'phaser';

export class StaticObjects {
  scene: Phaser.Scene;
  imageCenter: number = 1920 / 2;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

}

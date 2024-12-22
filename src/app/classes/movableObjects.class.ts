
import Phaser from 'phaser';

export class MovableObjects {
  scene: Phaser.Scene;

  healthPoints: number = 100
  height!: number;
  width!: number; 

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  loadImages(amount: number, key: string, path:string){
    for (let i = 1; i < amount; i++) {
      this.scene.load.image((key + i), `${path}${i}.png`)
    }
  }

}
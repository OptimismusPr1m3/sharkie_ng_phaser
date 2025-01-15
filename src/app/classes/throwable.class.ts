import { MovableObjects } from './movableObjects.class';

export class Throwable extends MovableObjects {

    bubbleColorPath: string;
    bubbleName: string;

  constructor(scene: Phaser.Scene, bubbleName: string  ,colorPath: string) {
    super(scene);
    this.bubbleName = bubbleName;
    this.bubbleColorPath = colorPath;
  }

  preload() {
    this.scene.load.image(
      this.bubbleName,
      this.bubbleColorPath
    );
  }

  spawnThrowable(xPosition: number, yPosition: number, speedX: number = 300){
    const bubble = this.scene.physics.add.sprite(xPosition, yPosition, this.bubbleName);
    bubble.setVelocityX(speedX);
    bubble.setCollideWorldBounds(true);
    bubble.body.onWorldBounds = true;
    bubble.setScale(0.3)    
    this.scene.time.delayedCall(3000, () => bubble.destroy());
  }

}

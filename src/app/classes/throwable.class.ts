import { GlobalstateserviceService } from '../services/globalstate.service';
import { MovableObjects } from './movableObjects.class';

export class Throwable extends MovableObjects {
  bubbleSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bubbleColorPath: string;
  bubbleName: string;

  constructor(
    scene: Phaser.Scene,
    bubbleName: string,
    colorPath: string,
    public globalStateService: GlobalstateserviceService
  ) {
    super(scene);
    this.bubbleName = bubbleName;
    this.bubbleColorPath = colorPath;
    console.log('GlobalstateserviceService:', globalStateService); // Debug-Log
  }

  preload() {
    this.scene.load.image(this.bubbleName, this.bubbleColorPath);
  }

  spawnThrowable(xPosition: number, yPosition: number, speedX: number = 300) {
    const bubble = this.scene.physics.add.sprite(
      xPosition,
      yPosition,
      this.bubbleName
    );
    this.globalStateService.addBubble(bubble);
    bubble.setVelocityX(speedX);
    bubble.setCollideWorldBounds(true);
    bubble.body.onWorldBounds = true;
    bubble.setScale(0.3);
    this.scene.time.delayedCall(3000, () => {
      bubble.destroy();
      this.globalStateService.removeBubble(bubble);
      console.log('Bubble destroyed', this.globalStateService.getBubbles());
    });
  }
}

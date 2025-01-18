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
  }

  preload() {
    this.scene.load.image(this.bubbleName, this.bubbleColorPath);
  }

  spawnThrowable(
    xPosition: number,
    yPosition: number,
    speedX: number = 300,
    color: string
  ) {
    const bubble = this.scene.physics.add.sprite(
      xPosition,
      yPosition,
      this.bubbleName
    );
    if (color === 'green') {
      this.throwGreenBubble(bubble, speedX);
    } else if (color === 'white') {
      this.throwWhiteBubble(bubble, speedX);
    }
  }

  throwGreenBubble(
    bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speedX: number
  ) {
    this.globalStateService.addPBubble(bubble);
    bubble.setVelocityX(speedX);
    bubble.setCollideWorldBounds(true);
    bubble.body.onWorldBounds = true;
    bubble.setScale(0.3);
    this.scene.time.delayedCall(3000, () => {
      bubble.destroy();
      this.globalStateService.removePBubble(bubble);
      console.log('Bubble destroyed', this.globalStateService.getPBubbles());
    });
  }
  throwWhiteBubble(
    bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speedX: number
  ) {
    this.globalStateService.addWBubble(bubble);
    bubble.setVelocityX(speedX);
    bubble.setCollideWorldBounds(true);
    bubble.body.onWorldBounds = true;
    bubble.setScale(0.3);
    this.scene.time.delayedCall(3000, () => {
      bubble.destroy();
      this.globalStateService.removeWBubble(bubble);
      console.log('Bubble destroyed', this.globalStateService.getWBubbles());
    });
  } 
}

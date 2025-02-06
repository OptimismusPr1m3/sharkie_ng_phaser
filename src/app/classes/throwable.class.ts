import { GlobalstateserviceService } from '../services/globalstate.service';
import { MovableObjects } from './movableObjects.class';

export class Throwable extends MovableObjects {
  bubbleSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bubbleColorPath: string;
  bubbleName: string;
  emptyTexture!: any;

  constructor(
    scene: Phaser.Scene,
    bubbleName: string,
    colorPath: string,
    public globalStateService: GlobalstateserviceService
  ) {
    super(scene, globalStateService);
    this.bubbleName = bubbleName;
    this.bubbleColorPath = colorPath;
  }

  preload() {
    if (this.bubbleColorPath !== undefined) {
      this.scene.load.image(this.bubbleName, this.bubbleColorPath);
    }
    if (!this.scene.textures.exists("empty")) {
      const canvas = this.scene.textures.createCanvas("empty", 1, 1);
      if (canvas) {
        canvas.context.fillStyle = "rgba(0,0,0,0)"; // Transparente Farbe
        canvas.context.fillRect(0, 0, 1, 1);
        canvas.refresh();
      }
    }
  }

  spawnThrowable(
    xPosition: number,
    yPosition: number,
    speedX: number = 300,
    color: string
  ) {
    if (color === 'green') {
      const bubble = this.scene.physics.add.sprite(
        xPosition,
        yPosition,
        this.bubbleName
      );
      this.throwGreenBubble(bubble, speedX);
    } else if (color === 'white') {
      const bubble = this.scene.physics.add.sprite(
        xPosition,
        yPosition,
        this.bubbleName
      );
      this.throwWhiteBubble(bubble, speedX);
    } else if (color === 'slap') {
      const slapBox = this.scene.physics.add.sprite(
        xPosition,
        yPosition,
        this.bubbleName
      );
      this.throwSlapBox(slapBox, speedX);
    }
  }

  throwSlapBox(
    slapBox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speedX: number) {
    this.globalStateService.addSlapBox(slapBox);
    slapBox.setVelocityX(speedX);
    slapBox.setCollideWorldBounds(true);
    slapBox.setScale(0.3);
    slapBox.setAlpha(0.0)
    this.scene.time.delayedCall(50, () => {
      slapBox.destroy();
      this.globalStateService.removeSlapBox(slapBox);
      console.log('SlapBox destroyed', this.globalStateService.getSlapBoxes());
    })
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
      //console.log('Bubble destroyed', this.globalStateService.getPBubbles());
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
      //console.log('Bubble destroyed', this.globalStateService.getWBubbles());
    });
  }
}

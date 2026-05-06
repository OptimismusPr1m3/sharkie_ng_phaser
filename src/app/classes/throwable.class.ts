import { GAME_CONFIG } from '../game.config';
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
    super(scene, globalStateService);
    this.bubbleName = bubbleName;
    this.bubbleColorPath = colorPath;
  }

  preload() {
    if (this.bubbleColorPath !== undefined) {
      this.scene.load.image(this.bubbleName, this.bubbleColorPath);
    }
    if (!this.scene.textures.exists('empty')) {
      const canvas = this.scene.textures.createCanvas('empty', 1, 1);
      if (canvas) {
        canvas.context.fillStyle = 'rgba(0,0,0,0)'; // Transparente Farbe
        canvas.context.fillRect(0, 0, 1, 1);
        canvas.refresh();
      }
    }
  }

  spawnThrowable(
    xPosition: number,
    yPosition: number,
    speedX: number = GAME_CONFIG.BUBBLE_SPEED,
    color: 'green' | 'white' | 'slap'
  ) {
    const sprite = this.scene.physics.add.sprite(xPosition, yPosition, this.bubbleName);
    if (color === 'slap') {
      this.throwSlapBox(sprite, speedX);
    } else {
      this.throwBubble(sprite, speedX, color);
    }
  }

  private throwBubble(
    bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speedX: number,
    type: 'green' | 'white'
  ) {
    if (type === 'green') {
      this.globalStateService.addPBubble(bubble);
    } else {
      this.globalStateService.addWBubble(bubble);
    }
    bubble.setVelocityX(speedX);
    bubble.setCollideWorldBounds(true);
    bubble.body.onWorldBounds = true;
    bubble.setScale(GAME_CONFIG.BUBBLE_SCALE);
    this.scene.time.delayedCall(GAME_CONFIG.BUBBLE_LIFETIME_MS, () => {
      bubble.destroy();
      if (type === 'green') {
        this.globalStateService.removePBubble(bubble);
      } else {
        this.globalStateService.removeWBubble(bubble);
      }
    });
  }

  private throwSlapBox(
    slapBox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    speedX: number
  ) {
    this.globalStateService.addSlapBox(slapBox);
    slapBox.setVelocityX(speedX);
    slapBox.setCollideWorldBounds(true);
    slapBox.setScale(GAME_CONFIG.BUBBLE_SCALE);
    slapBox.setAlpha(0.0);
    this.scene.time.delayedCall(GAME_CONFIG.SLAP_BOX_LIFETIME_MS, () => {
      slapBox.destroy();
      this.globalStateService.removeSlapBox(slapBox);
    });
  }
}

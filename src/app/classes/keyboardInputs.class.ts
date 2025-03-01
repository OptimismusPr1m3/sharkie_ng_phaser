import Phaser from 'phaser';
import { CustomKeys } from '../interfaces/CustomKeys.interface';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export class KeyboardInputs {
  private keys!: CustomKeys; //the interface which extends the cursorkeyes type with new keys, i.e. slap and w_bubble etc..
  private scene: Phaser.Scene;
  private joystick!: any;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  initializeInputs() {
    this.keys = this.scene.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      slap: Phaser.Input.Keyboard.KeyCodes.F,
      w_bubble: Phaser.Input.Keyboard.KeyCodes.G,
    }) as CustomKeys;
    this.initializeVirtualJoystick();
    this.initializeMobileInputs();
  }

  initializeVirtualJoystick() {
    this.joystick = (
      this.scene.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin
    ).add(this.scene, {
      x: 150,
      y: this.scene.scale.height - 150,
      radius: 80,
      base: this.scene.add.circle(0, 0, 100, 0x888888),
      thumb: this.scene.add.circle(0, 0, 50, 0xcccccc),
    });
    if (this.scene.sys.game.device.os.desktop) {
      this.joystick.base.setAlpha(0.0);
      this.joystick.thumb.setAlpha(0.0);
    } else {
      this.joystick.base.setAlpha(0.5);
      this.joystick.thumb.setAlpha(0.5);
    }
  }

  initializeMobileInputs() {
    const buttonConfig = {
      fontSize: '28px',
      fontFamily: 'LGUY',
      color: '#ffffff',
      backgroundColor: '#444444',
      padding: { x: 5, y: 5 },
      fixedWidth: 110,
      fixedHeight: 40,
      align: 'center',
    };

    this.createButton(this.scene.scale.width - 450, this.scene.scale.height - 150, 'Slap', buttonConfig, this.keys.slap);
  
    this.createButton(this.scene.scale.width - 325, this.scene.scale.height - 150, 'Bubble', buttonConfig, this.keys.w_bubble);

    this.createButton(this.scene.scale.width - 200, this.scene.scale.height - 150, 'Poison', buttonConfig, this.keys.space)
  }

  createButton(x: number, y: number, text: string, style: any, key: Phaser.Input.Keyboard.Key) {
    const button = this.scene.add.text(x, y, text, style)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        (key as any).isDown = true;
        button.setBackgroundColor('#666666'); 
      })
      .on('pointerup', () => {
        (key as any).isDown = false;
        button.setBackgroundColor('#444444'); 
      });
  
    if (this.scene.sys.game.device.os.desktop) {
      button.setAlpha(0); 
    } else {
      button.setAlpha(0.8);
    }
  }


  getCursorKeys(): CustomKeys {
    return this.keys;
  }

  getJoystick() {
    return {
      left: this.joystick.left,
      right: this.joystick.right,
      up: this.joystick.up,
      down: this.joystick.down,
    };
  }
}

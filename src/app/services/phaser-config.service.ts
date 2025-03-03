import { Injectable } from '@angular/core';
import Phaser from 'phaser';
import { GlobalstateserviceService } from './globalstate.service';
import { Gamescene } from '../scenes/gamescene';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

@Injectable({
  providedIn: 'root',
})
export class PhaserConfigService {
  private phaserConfig!: Phaser.Types.Core.GameConfig;

  constructor(private globalStateService: GlobalstateserviceService) {}

  initializeConfig() {
    if (!this.phaserConfig) {
      this.phaserConfig = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
          },
        },
        plugins: {
          global: [
            {
              key: 'rexVirtualJoystick',
              plugin: VirtualJoystickPlugin,
              mapping: 'rexVirtualJoystick',
            },
          ],
        },
        parent: null,
        scene: [new Gamescene(this.globalStateService)],
      };
    }
  }

  getConfig() {
    return this.phaserConfig;
  }

  toggleFullScreen(game: Phaser.Game) {
    if (game.scale.isFullscreen) {
      game.scale.stopFullscreen();
    } else {
      game.scale.startFullscreen();
    }
  }
  
}

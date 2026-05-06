import { Injectable, signal } from '@angular/core';
import { GAME_CONFIG } from '../game.config';

@Injectable({
  providedIn: 'root',
})
export class GlobalstateserviceService {
  activePBubbles = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>([]);
  activeWBubbles = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>([]);
  activeSlapBoxes = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>([]);
  hasSlapped = signal<boolean>(false);
  currentPotions = signal<number>(GAME_CONFIG.INITIAL_POTIONS);
  currentCoins = signal<number>(GAME_CONFIG.INITIAL_COINS);
  currentHealth = signal<number>(GAME_CONFIG.INITIAL_HEALTH);

  isShowingFPS = signal<boolean>(false);
  isShowingHitboxes = signal<boolean>(false);
  isFullScreen = signal<boolean>(false);

  isWinLoseScreen = signal<boolean>(false);
  playerWinState = signal<boolean>(false);
  wantsRestart = signal<boolean>(false);
  randomizedPostionsX = signal<number[]>([]);
  randomizedPostionsY = signal<number[]>([]);

  constructor() {}

  restart() {
    this.activePBubbles.set([]);
    this.activeWBubbles.set([]);
    this.activeSlapBoxes.set([]);
    this.hasSlapped.set(false);
    this.currentPotions.set(GAME_CONFIG.INITIAL_POTIONS);
    this.currentCoins.set(GAME_CONFIG.INITIAL_COINS);
    this.currentHealth.set(GAME_CONFIG.INITIAL_HEALTH);
    this.isShowingFPS.set(false);
    this.isShowingHitboxes.set(false);
    this.isFullScreen.set(false);
    this.isWinLoseScreen.set(false);
    this.playerWinState.set(false);
  }

  getPBubbles() {
    return this.activePBubbles();
  }

  getSlapBoxes() {
    return this.activeSlapBoxes();
  }

  modifyProgressbar(barName: string, value: number) {
    switch (barName) {
      case 'potions': {
        const newPotions = this.currentPotions() + value;
        if (newPotions <= GAME_CONFIG.MAX_POTIONS && newPotions > 0) {
          this.currentPotions.set(newPotions);
        }
        break;
      }
      case 'coin': {
        const newCoins = this.currentCoins() + value;
        if (newCoins <= GAME_CONFIG.MAX_COINS && newCoins > 0) {
          this.currentCoins.set(newCoins);
        }
        break;
      }
      case 'health': {
        const newHealth = this.currentHealth() + value;
        if (newHealth <= GAME_CONFIG.MAX_HEALTH && newHealth > 0) {
          this.currentHealth.set(newHealth);
        } else if (newHealth < 1) {
          this.currentHealth.set(1);
        }
        break;
      }
    }
  }

  addPBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.activePBubbles.set([...this.activePBubbles(), bubble]);
  }

  removePBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.activePBubbles.set(this.activePBubbles().filter((b) => b !== bubble));
  }

  getWBubbles() {
    return this.activeWBubbles();
  }

  addWBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.activeWBubbles.set([...this.activeWBubbles(), bubble]);
  }

  removeWBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.activeWBubbles.set(this.activeWBubbles().filter((b) => b !== bubble));
  }

  addSlapBox(slapBox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.activeSlapBoxes.set([...this.activeSlapBoxes(), slapBox]);
  }

  removeSlapBox(slapBox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.activeSlapBoxes.set(this.activeSlapBoxes().filter((b) => b !== slapBox));
  }
}

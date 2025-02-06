import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalstateserviceService {
  activePBubbles = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>(
    []
  );
  activeWBubbles = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>(
    []
  );
  activeSlapBoxes = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>([]);
  hasSlapped = signal<boolean>(false);
  currentPotions = signal<number>(1);
  currentCoins = signal<number>(1);
  currentHealth = signal<number>(6);

  constructor() {}

  getPBubbles() {
    return this.activePBubbles();
  }
  getSlapBoxes() {
    return this.activeSlapBoxes();
  }

  modifyProgressbar(barName: string, value: number) {
    switch (barName) {
      case 'potions':
        if (this.currentPotions() + value <= 6 && this.currentPotions() + value > 0) {
          this.currentPotions.set(this.currentPotions() + value);
        }
        console.log('Potions:', this.currentPotions());
        break;
      case 'coin':
        if (this.currentCoins() + value <= 6 && this.currentCoins() + value > 0) {
          this.currentCoins.set(this.currentCoins() + value);
        }
        console.log('Coins:', this.currentCoins());
        break;
      case 'health':
        if (this.currentHealth() + value < 6 && this.currentHealth() + value > 0) {
          this.currentHealth.set(this.currentHealth() + value);
        }
        console.log('Health:', this.currentHealth());
        break;
      default:
        break;
    }
  }

  checkNegativeProgressbar(barName: string) {

  }

  addPBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const bubbles = this.activePBubbles();
    this.activePBubbles.set([...bubbles, bubble]);
  }

  removePBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const bubbles = this.activePBubbles();
    this.activePBubbles.set(bubbles.filter((b) => b !== bubble));
  }

  getWBubbles() {
    return this.activeWBubbles();
  }

  addWBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const bubbles = this.activeWBubbles();
    this.activeWBubbles.set([...bubbles, bubble]);
  }

  removeWBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const bubbles = this.activeWBubbles();
    this.activeWBubbles.set(bubbles.filter((b) => b !== bubble));
  }

  addSlapBox(slapBox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const slapBoxes = this.activeSlapBoxes();
    this.activeSlapBoxes.set([...slapBoxes, slapBox]);
  }

  removeSlapBox(slapBox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const slapBoxes = this.activeSlapBoxes();
    this.activeSlapBoxes.set(slapBoxes.filter((b) => b !== slapBox));
  }

}

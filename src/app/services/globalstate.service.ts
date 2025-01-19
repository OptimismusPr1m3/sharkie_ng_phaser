import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalstateserviceService {

  activePBubbles = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>([]);
  activeWBubbles = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>([]);
  hasSlapped = signal<boolean>(false);
  

  constructor() { }

  getPBubbles() {
    return this.activePBubbles();
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

}

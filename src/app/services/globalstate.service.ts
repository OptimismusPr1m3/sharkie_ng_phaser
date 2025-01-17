import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalstateserviceService {

  activeBubbles = signal<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>([]);

  constructor() { }

  getBubbles() {
    return this.activeBubbles();
  }

  addBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const bubbles = this.activeBubbles();
    this.activeBubbles.set([...bubbles, bubble]);
  }

  removeBubble(bubble: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const bubbles = this.activeBubbles();
    this.activeBubbles.set(bubbles.filter((b) => b !== bubble));
  }

}

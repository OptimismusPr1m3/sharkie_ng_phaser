import { Component } from '@angular/core';
import { GameComponent } from "../game/game.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landingpage',
  imports: [GameComponent, CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  isPlayGamePressed: boolean = false;
  isChoosing: boolean = true;

  startGame() {
    this.isChoosing = !this.isChoosing
    this.isPlayGamePressed = !this.isPlayGamePressed
  }

  openInstructions() {
    
  }

}

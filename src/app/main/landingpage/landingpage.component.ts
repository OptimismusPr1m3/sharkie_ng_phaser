import { Component } from '@angular/core';
import { GameComponent } from "../game/game.component";

@Component({
  selector: 'app-landingpage',
  imports: [GameComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  isPlayGamePressed: boolean = false;

}

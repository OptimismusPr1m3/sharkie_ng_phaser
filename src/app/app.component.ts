import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from "./main/game/game.component";
import { GlobalstateserviceService } from './services/globalstate.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sharkie';

  constructor(public globalStateService: GlobalstateserviceService) {
  }

}

import { Routes } from '@angular/router';
import { GameComponent } from './main/game/game.component';
import { LandingpageComponent } from './main/landingpage/landingpage.component';

export const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'game', component: GameComponent },
];

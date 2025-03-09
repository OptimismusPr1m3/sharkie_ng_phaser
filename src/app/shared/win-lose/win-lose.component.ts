import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { GlobalstateserviceService } from '../../services/globalstate.service';

@Component({
  selector: 'app-win-lose',
  imports: [CommonModule],
  templateUrl: './win-lose.component.html',
  styleUrl: './win-lose.component.scss'
})
export class WinLoseComponent {

  won!: boolean;
  isWinLoseScreen = output<boolean>();
  isRestarting = output<boolean>();
  isBackHome = output<boolean>();

  constructor(public globalStates: GlobalstateserviceService) {
    this.won = this.globalStates.playerWinState();
  }

  ngOnInit() {
    this.isWinLoseScreen.emit(true);
  }

  restart() {
    this.isRestarting.emit(true);
  }

  backHome() {
    this.isBackHome.emit(true);
  }

}

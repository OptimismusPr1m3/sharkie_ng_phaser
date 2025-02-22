import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-key',
  imports: [CommonModule],
  templateUrl: './key.component.html',
  styleUrl: './key.component.scss'
})
export class KeyComponent {

  key = input<string>();
  isSpace = input<boolean>(false);
  isWASDBlock = input<boolean>(false);

  keyHeight = input<number>(60);
  keyWidth = input<number>(60);

}

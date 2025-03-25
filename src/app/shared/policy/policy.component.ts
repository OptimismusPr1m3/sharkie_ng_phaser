import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-policy',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss',
})
export class PolicyComponent {

  @ViewChild('policy') policy!: ElementRef;

  ngAfterViewInit() {
    this.policy.nativeElement.scrollTop = 0;
  }

}

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalvariablesService {

  constructor() { }

  imageCenter = signal<number>(1920 / 2);

}

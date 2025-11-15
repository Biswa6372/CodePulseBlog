import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  showImageSelector = signal<boolean>(false);

  displayImageSelector() {
    this.showImageSelector.set(true);
  }
  hideImageSelector() {
    this.showImageSelector.set(false);
  }

}
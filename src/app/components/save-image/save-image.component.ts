import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-save-image',
  templateUrl: './save-image.component.html'
})

export class SaveImageComponent implements OnInit, AfterViewInit{
  msSupportDownload: boolean = false;
  constructor() { }

  ngAfterViewInit() {
    this.msSupportDownload = !!window.navigator.msSaveOrOpenBlob; // From save file in all browsers
  }
  ngOnInit() {
  }

  // Save only IE
  saveFile(img, canvasForImg) {
    try {
      const canvas = canvasForImg;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      window.navigator.msSaveBlob(canvas.msToBlob(), 'qr-code.png');
    } catch (e) {
      throw e;
    }
  }
}

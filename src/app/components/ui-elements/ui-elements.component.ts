import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-save-image',
  templateUrl: './ui-elements.component.html'
})

export class UIPageComponent implements OnInit, AfterViewInit {
  msSupportDownload: boolean = false;

  constructor() {
  }

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

  // Drag&Drop
  borderDropArea = false;
  accountFileName = 'Json file name';

  openFile(event) {
    let input = event.target;
    this.getTextFromFile(input);
  }

  onDrop(event) {
    const input = event.dataTransfer;
    this.getTextFromFile(input);
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOver(event) {
    if (!this.borderDropArea) this.borderDropArea = true;
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOut(event) {
    if (this.borderDropArea) this.borderDropArea = false;
    event.stopPropagation();
    event.preventDefault();
  }

  getTextFromFile(input) {
    this.accountFileName = input.files[0].name;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        var text = reader.result;
        console.log(text)
      }
      reader.readAsText(input.files[index]);
    }
  }
}

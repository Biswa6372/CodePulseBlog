import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./core/components/navbar/navbar";
import { ImageSelector } from './shared/components/image-selector/image-selector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar,ImageSelector],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CodePulse');
}

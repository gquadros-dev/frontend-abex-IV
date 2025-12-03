import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Brechó Online';

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}

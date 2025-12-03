import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}

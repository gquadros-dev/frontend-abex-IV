import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tenant-layout',
  standalone: true,
  templateUrl: './tenant-layout.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './tenant-layout.css'
})
export class TenantLayout implements OnInit {
  tenantId: string | null = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.tenantId = params.get('tenantId');
      })
  }
}

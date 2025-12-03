import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-tenant-layout',
  standalone: true,
  templateUrl: './tenant-layout.html',
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    AsyncPipe
  ],
  styleUrl: './tenant-layout.css'
})
export class TenantLayout implements OnInit {
  tenantId: string | null = '';
  isMobile = false;
  sidenavOpened = false;
  sidenavPinned = false; // Controla se foi clicado no hambúrguer
  isAuthenticated$: any;

  menuItems: MenuItem[] = [
    { label: 'Catálogo', icon: 'store', route: '' },
    { label: 'Home', icon: 'home', route: 'home' },
    { label: 'Produtos', icon: 'inventory_2', route: 'produtos' },
    { label: 'Fornecedores', icon: 'local_shipping', route: 'fornecedores' },
    { label: 'Variações', icon: 'category', route: 'variacoes' },
    { label: 'Vendas', icon: 'point_of_sale', route: 'vendas' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    // Obter tenantId imediatamente do snapshot
    this.tenantId = this.route.snapshot.paramMap.get('tenantId');

    // Também escutar mudanças
    this.route.paramMap.subscribe(params => {
      this.tenantId = params.get('tenantId');
    });

    // Verificar se é mobile
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sidenavOpened = false;
          this.sidenavPinned = false;
        }
      });
  }

  toggleSidenav() {
    this.sidenavPinned = !this.sidenavPinned;
    this.sidenavOpened = this.sidenavPinned;
  }

  onSidenavMouseEnter() {
    // Quando o mouse entra na sidebar
    if (!this.sidenavPinned && !this.isMobile && this.authService.isAuthenticated) {
      this.sidenavOpened = true;
    }
  }

  onSidenavMouseLeave() {
    // Quando o mouse sai da sidebar
    if (!this.sidenavPinned && !this.isMobile && this.authService.isAuthenticated) {
      // Pequeno delay para permitir transição suave
      setTimeout(() => {
        if (!this.sidenavPinned) {
          this.sidenavOpened = false;
        }
      }, 100);
    }
  }

  onHoverAreaEnter() {
    // Quando o mouse entra na área de hover (borda esquerda)
    if (!this.sidenavPinned && !this.isMobile && this.authService.isAuthenticated) {
      this.sidenavOpened = true;
    }
  }

  onHoverAreaLeave() {
    // Quando o mouse sai da área de hover, não faz nada
    // A sidebar só fecha quando o mouse sai dela (onSidenavMouseLeave)
  }

  getRoute(route: string): any[] {
    if (!this.tenantId) {
      console.warn('tenantId não disponível ainda');
      return [];
    }
    const routeArray = route === '' ? [this.tenantId] : [this.tenantId, route];
    console.log('getRoute:', route, '->', routeArray);
    return routeArray;
  }

  navigateToRoute(item: MenuItem) {
    if (!this.tenantId) {
      console.warn('tenantId não disponível para navegação');
      return;
    }
    const routeArray = item.route === '' ? [this.tenantId] : [this.tenantId, item.route];
    console.log('Navegando para:', routeArray);
    this.router.navigate(routeArray).then(
      (success) => console.log('Navegação bem-sucedida:', success),
      (error) => console.error('Erro na navegação:', error)
    );
    if (this.isMobile) {
      this.sidenavOpened = false;
      this.sidenavPinned = false;
    }
  }

  isRouteActive(route: string): boolean {
    if (!this.tenantId) return false;
    const currentUrl = this.router.url;
    if (route === '') {
      return currentUrl === `/${this.tenantId}` || currentUrl === `/${this.tenantId}/`;
    }
    return currentUrl.includes(`/${this.tenantId}/${route}`);
  }

  navigate(route: string) {
    if (this.tenantId) {
      this.router.navigate([this.tenantId, route]);
      if (this.isMobile) {
        this.sidenavOpened = false;
        this.sidenavPinned = false;
      }
    }
  }

  login() {
    this.authService.login();
    // Redirecionar para a home após login
    this.router.navigate([this.tenantId, 'home']);
  }

  logout() {
    this.authService.logout();
    // Voltar para o catálogo do tenant
    this.router.navigate([this.tenantId]);
  }
}

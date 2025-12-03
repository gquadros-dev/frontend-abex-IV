import { Routes } from '@angular/router';
import { FornecedoresComponent } from './components/fornecedores/fornecedores';
import { ListaProdutosComponent } from './components/lista-produtos/lista-produtos.component';
import { ProdutoDetailComponent } from './components/produto-detail/produto-detail.component';
import { ProdutoFormComponent } from './components/produto-form/produto-form';
import { ProdutoVariationComponent } from './components/produto-variation/produto-variation';
import { VendasListComponent } from './components/vendas-list/vendas-list';
import { Home } from './home/home';
import { TenantLayout } from './tenant-layout/tenant-layout';

export const routes: Routes = [
  {
    path: ':tenantId',
    component: TenantLayout,
    children: [
      { path: 'home', component: Home },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'lista-produtos', component: ListaProdutosComponent },
      { path: 'fornecedores', component: FornecedoresComponent },
      { path: 'produtos', component: ProdutoFormComponent },
      { path: 'produtos/:id', component: ProdutoDetailComponent },
      { path: 'variacoes', component: ProdutoVariationComponent },
      { path: 'vendas', component: VendasListComponent }
    ]
  },
  {
    path: '**',
    redirectTo: 'default_tenant/home'
  }
];

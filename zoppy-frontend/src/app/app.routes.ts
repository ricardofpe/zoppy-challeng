import type { Routes } from "@angular/router"
import { ProdutosComponent } from "./components/produtos/produtos.component"
import { PedidosComponent } from "./components/pedidos/pedidos.component"
import { ProdutoEditComponent } from "./components/produtos/produto-edit/produto-edit.component"
import { PedidoEditComponent } from "./components/pedidos/pedido-edit/pedido-edit.component"
import { DashboardComponent } from "./components/dashboard/dashboard.component"

export const routes: Routes = [
  { path: "produtos", component: ProdutosComponent },
  { path: "produtos/novo", component: ProdutoEditComponent },
  { path: "produtos/:id", component: ProdutoEditComponent },   

  { path: "pedidos", component: PedidosComponent },
  { path: "pedidos/novo", component: PedidoEditComponent },   
  { path: "pedidos/:id", component: PedidoEditComponent },     

  { path: "dashboard", component: DashboardComponent },

  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/dashboard" },
]
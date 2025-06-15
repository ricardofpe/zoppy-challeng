import type { Routes } from "@angular/router"
import { ProdutosComponent } from "./components/produtos/produtos.component"
import { PedidosComponent } from "./components/pedidos/pedidos.component"

export const routes: Routes = [
  { path: "produtos", component: ProdutosComponent },
  { path: "pedidos", component: PedidosComponent },
  { path: "", redirectTo: "/pedidos", pathMatch: "full" },
  { path: "**", redirectTo: "/pedidos" },
]

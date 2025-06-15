import { Component, inject, signal, computed, type OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe, registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Router } from "@angular/router";
import { PedidoService } from "../../services/pedido.service";
import type { Pedido } from "../../models/pedido.model";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "../../header/header.component";
import { ProdutoService } from "../../services/produto.service";
import type { Produto } from "../../models/produto.model";

registerLocaleData(localePt, "pt-BR");

@Component({
    selector: "app-pedidos",
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, CurrencyPipe, RouterModule, HeaderComponent],
    templateUrl: "./pedidos.component.html",
})
export class PedidosComponent implements OnInit {
    private pedidoService = inject(PedidoService);
    private produtoService = inject(ProdutoService);
    private router = inject(Router);

    pedidos = signal<Pedido[]>([]);
    selectedPedido = signal<Pedido | null>(null);
    loading = signal(false);
    error = signal("");

    produtos = signal<Produto[]>([]);

    hasPedidos = computed(() => this.pedidos().length > 0);

    currentPage = signal(1);
    pageSize = signal(10);
    totalItems = signal(0);
    totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    clienteFilter = signal("");
    statusFilter = signal("");
    dataPedidoInicioFilter = signal("");
    dataPedidoFimFilter = signal("");
    produtoFilter = signal<number | null>(null);

    ngOnInit() {
        this.loadPedidos();
        this.loadProdutos();
    }

    loadPedidos() {
        this.loading.set(true);
        this.error.set("");

        const filters = {
            page: this.currentPage(),
            limit: this.pageSize(),
            cliente: this.clienteFilter(),
            status: this.statusFilter(),
            dataPedidoInicio: this.dataPedidoInicioFilter(),
            dataPedidoFim: this.dataPedidoFimFilter(),
        };

        this.pedidoService.findAll(filters).subscribe({
            next: (response) => {
                this.pedidos.set(response.rows);
                this.totalItems.set(response.count);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set("Erro ao carregar pedidos");
                this.loading.set(false);
                console.error(err);
            },
        });
    }

    loadProdutos() {
        this.produtoService.findAll().subscribe({
            next: (produtos) => {
                this.produtos.set(produtos);
            },
            error: (err) => {
                this.error.set("Erro ao carregar produtos");
                console.error(err);
            },
        });
    }

    navigateToCreate() {
        this.router.navigate(['/pedidos/novo']);
    }

 navigateToEdit(pedido: Pedido) {
    this.router.navigate(['/pedidos', pedido.id]); 
}

    deletePedido(id: number) {
        if (confirm("Tem certeza que deseja excluir este pedido?")) {
            this.pedidoService.remove(id).subscribe({
                next: () => {
                    this.loadPedidos();
                },
                error: (err) => {
                    this.error.set("Erro ao excluir pedido");
                    console.error(err);
                },
            });
        }
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case "pendente":
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            case "em processamento":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "concluido":
                return "bg-green-100 text-green-800 border border-green-200";
            case "cancelado":
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
            this.loadPedidos();
        }
    }

    get pageNumbers(): number[] {
        const pageCount = this.totalPages();
        const currentPage = this.currentPage();
        const delta = 2;

        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift(-1);
        }

        if (currentPage + delta < pageCount - 1) {
            range.push(-1);
        }

        range.unshift(1);
        if (pageCount > 1) {
            range.push(pageCount);
        }

        return [...new Set(range)];
    }

    isEllipsis(pageNumber: number): boolean {
        return pageNumber === -1;
    }

    applyFilters() {
        this.currentPage.set(1);
        this.loadPedidos();
    }

    clearFilters() {
        this.clienteFilter.set("");
        this.statusFilter.set("");
        this.dataPedidoInicioFilter.set("");
        this.dataPedidoFimFilter.set("");
        this.produtoFilter.set(null);
        this.applyFilters();
    }
}
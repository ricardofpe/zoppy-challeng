import { Component, inject, signal, computed, type OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe, registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
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

    pedidos = signal<Pedido[]>([]);
    selectedPedido = signal<Pedido | null>(null);
    showForm = signal(false);
    isEditing = signal(false);
    loading = signal(false);
    error = signal("");

    newPedido = signal<Pedido>({
        cliente: "",
        dataPedido: new Date().toISOString().slice(0, 10),
        valorTotal: 0,
        status: "pendente",
        produtoIds: [],
        produtos: []
    });

    produtos = signal<Produto[]>([]);
    selectedProducts = signal<Produto[]>([]);

    hasPedidos = computed(() => this.pedidos().length > 0);
    isFormVisible = computed(() => this.showForm());

    currentPage = signal(1);
    pageSize = signal(10);
    totalItems = signal(0);
    totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    clienteFilter = signal("");
    statusFilter = signal("");
    dataPedidoInicioFilter = signal("");
    dataPedidoFimFilter = signal("");
    produtoFilter = signal<number | null>(null);

    filteredPedidos = computed(() => {
        const clienteFilter = this.clienteFilter().toLowerCase();
        const statusFilter = this.statusFilter().toLowerCase();
        const dataPedidoInicioFilter = this.dataPedidoInicioFilter();
        const dataPedidoFimFilter = this.dataPedidoFimFilter();
        const produtoFilter = this.produtoFilter();

        return this.pedidos().filter(pedido => {
            const clienteMatch = pedido.cliente.toLowerCase().includes(clienteFilter);
            const statusMatch = statusFilter === "" || pedido.status.toLowerCase() === statusFilter;

            let dataPedidoMatch = true;
            if (dataPedidoInicioFilter && dataPedidoFimFilter) {
                const pedidoDate = new Date(pedido.dataPedido);
                const startDate = new Date(dataPedidoInicioFilter);
                const endDate = new Date(dataPedidoFimFilter);
                dataPedidoMatch = pedidoDate >= startDate && pedidoDate <= endDate;
            } else if (dataPedidoInicioFilter) {
                const pedidoDate = new Date(pedido.dataPedido);
                const startDate = new Date(dataPedidoInicioFilter);
                dataPedidoMatch = pedidoDate >= startDate;
            } else if (dataPedidoFimFilter) {
                const pedidoDate = new Date(pedido.dataPedido);
                const endDate = new Date(dataPedidoFimFilter);
                dataPedidoMatch = pedidoDate <= endDate;
            }

            let produtoMatch = true;
            if (produtoFilter !== null) {
                if (pedido.produtoIds && pedido.produtoIds.length > 0) {
                    produtoMatch = pedido.produtoIds.includes(produtoFilter);
                } else {
                    produtoMatch = false;
                }
            }

            return clienteMatch && statusMatch && dataPedidoMatch && produtoMatch;
        });
    });

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

    showCreateForm() {
        this.showForm.set(true);
        this.isEditing.set(false);
        this.selectedPedido.set(null);
        this.newPedido.set({
            cliente: "",
            dataPedido: new Date().toISOString().slice(0, 10),
            valorTotal: 0,
            status: "pendente",
            produtoIds: [],
            produtos: []
        });
        this.selectedProducts.set([]);
    }

    showEditForm(pedido: Pedido) {
        this.showForm.set(true);
        this.isEditing.set(true);
        this.selectedPedido.set(pedido);

        const formattedDate = new Date(pedido.dataPedido).toISOString().slice(0, 10);
        this.newPedido.set({
            ...pedido,
            dataPedido: formattedDate,
            valorTotal: pedido.valorTotal,
            produtoIds: pedido.produtoIds ? [...pedido.produtoIds] : [],
            produtos: pedido.produtos ? [...pedido.produtos] : []
        });

        this.selectedProducts.set(pedido.produtos || []);
    }

    hideForm() {
        this.showForm.set(false);
        this.selectedPedido.set(null);
        this.isEditing.set(false);
    }

    savePedido() {
        const currentPedido = this.newPedido();
        const selectedPedido = this.selectedPedido();
        const selectedProducts = this.selectedProducts();

        const formattedDataPedido = new Date(currentPedido.dataPedido).toISOString();
        const produtoIds = selectedProducts.map(product => product.id!);
        const valorTotal = this.totalPedido;

        if (this.isEditing() && selectedPedido) {
            this.pedidoService.update(selectedPedido.id!, { ...currentPedido, dataPedido: formattedDataPedido, produtoIds: produtoIds, valorTotal: valorTotal }).subscribe({
                next: () => {
                    this.loadPedidos();
                    this.hideForm();
                },
                error: (err) => {
                    this.error.set("Erro ao atualizar pedido");
                    console.error(err);
                    this.error.set(err.message);
                },
            });
        } else {
            this.pedidoService.create({ ...currentPedido, dataPedido: formattedDataPedido, produtoIds: produtoIds, valorTotal: valorTotal }).subscribe({
                next: () => {
                    this.loadPedidos();
                    this.hideForm();
                },
                error: (err) => {
                    this.error.set("Erro ao criar pedido");
                    console.error(err);
                    this.error.set(err.message);
                },
            });
        }
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
                return "bg-yellow-100 text-yellow-800";
            case "em processamento":
                return "bg-blue-100 text-blue-800";
            case "concluido":
                return "bg-green-100 text-green-800";
            case "cancelado":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    updatePedidoField(field: keyof Pedido, value: any) {
        this.newPedido.update((pedido) => ({ ...pedido, [field]: value }));
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
        range.push(pageCount);

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

    toggleProductSelection(produto: Produto) {
        const currentProducts = this.selectedProducts();
        const productIndex = currentProducts.findIndex(p => p.id === produto.id);

        if (productIndex > -1) {
            currentProducts.splice(productIndex, 1);
        } else {
            currentProducts.push(produto);
        }

        this.selectedProducts.set([...currentProducts]);
        this.updateValorTotal();
    }

    isProductSelected(produto: Produto): boolean {
        return this.selectedProducts().some(p => p.id === produto.id);
    }

    get totalPedido(): number {
        let total = 0;
        for (const product of this.selectedProducts()) {
            total += Number(product.preco);
        }
        return total;
    }

    updateValorTotal() {
        this.newPedido.update(pedido => ({ ...pedido, valorTotal: this.totalPedido }));
    }
}
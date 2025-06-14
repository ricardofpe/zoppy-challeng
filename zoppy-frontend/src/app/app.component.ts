import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe, registerLocaleData } from "@angular/common";
import localePt from '@angular/common/locales/pt';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { PedidoService } from "./services/pedido.service";
import type { Pedido } from "./models/pedido.model";

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CurrencyPipe],
  templateUrl: "./app.component.html",

})
export class AppComponent implements OnInit {
  private pedidoService = inject(PedidoService);

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
  });

  hasPedidos = computed(() => this.pedidos().length > 0);
  isFormVisible = computed(() => this.showForm());

  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  ngOnInit() {
    this.loadPedidos();
  }

  loadPedidos() {
    this.loading.set(true);
    this.error.set("");

    this.pedidoService.findAll(this.currentPage(), this.pageSize()).subscribe({
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

  showCreateForm() {
    this.showForm.set(true);
    this.isEditing.set(false);
    this.selectedPedido.set(null);
    this.newPedido.set({
      cliente: "",
      dataPedido: new Date().toISOString().slice(0, 10),
      valorTotal: 0,
      status: "pendente",
    });
  }

  showEditForm(pedido: Pedido) {
    this.showForm.set(true);
    this.isEditing.set(true);
    this.selectedPedido.set(pedido);

    const formattedDate = new Date(pedido.dataPedido).toISOString().slice(0, 10);
    this.newPedido.set({ ...pedido, dataPedido: formattedDate });
  }

  hideForm() {
    this.showForm.set(false);
    this.selectedPedido.set(null);
    this.isEditing.set(false);
  }

  savePedido() {
    const currentPedido = this.newPedido();
    const selectedPedido = this.selectedPedido();

    const formattedDataPedido = new Date(currentPedido.dataPedido).toISOString();

    if (this.isEditing() && selectedPedido) {
      this.pedidoService.update(selectedPedido.id!, { ...currentPedido, dataPedido: formattedDataPedido }).subscribe({
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
      this.pedidoService.create({ ...currentPedido, dataPedido: formattedDataPedido }).subscribe({
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
      case "processando":
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

      let range = [];
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
}
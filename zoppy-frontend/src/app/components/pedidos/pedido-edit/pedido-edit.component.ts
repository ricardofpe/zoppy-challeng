import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { PedidoService } from '../../../services/pedido.service';
import { ProdutoService } from '../../../services/produto.service';
import { Pedido } from '../../../models/pedido.model';
import { Produto } from '../../../models/produto.model';

@Component({
  selector: 'app-pedido-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>

    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="container mx-auto px-4 py-6 sm:py-8">
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <button (click)="goBack()" 
              class="p-2 hover:bg-white rounded-lg transition-colors duration-200 border border-gray-200">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ isNewPedido() ? 'Novo Pedido' : 'Editar Pedido' }}</h1>
              <p class="text-gray-600">{{ isNewPedido() ? 'Crie um novo pedido' : 'Atualize as informações do pedido' }}</p>
            </div>
          </div>
        </div>

        @if (error()) {
        <div class="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error() }}</p>
            </div>
          </div>
        </div>
        }

        @if (success()) {
        <div class="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{{ success() }}</p>
            </div>
          </div>
        </div>
        }

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">Informações do Pedido</h2>
            <p class="text-sm text-gray-600 mt-1">Preencha todos os campos obrigatórios</p>
          </div>

          <form (ngSubmit)="savePedido()" class="p-6 space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Cliente <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  [(ngModel)]="pedido().cliente" 
                  name="cliente" 
                  required
                  placeholder="Nome do cliente"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Data do Pedido <span class="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  [(ngModel)]="pedido().dataPedido" 
                  name="dataPedido" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <div class="relative">
                  <select 
                    [(ngModel)]="pedido().status" 
                    name="status"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none">
                    <option value="pendente">Pendente</option>
                    <option value="Em Processamento">Em Processamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Valor Total</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">R$</span>
                  </div>
                  <input 
                    type="text" 
                    [value]="totalPedido() | currency:'BRL':'symbol':'1.2-2':'pt-BR'"
                    readonly
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-700 font-semibold" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-4">Produtos</label>
              <div class="bg-gray-50 rounded-xl p-4">
                @if (produtos().length === 0) {
                <p class="text-gray-500 text-center py-4">Nenhum produto disponível</p>
                } @else {
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  @for (produto of produtos(); track produto.id) {
                  <label class="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      (change)="toggleProductSelection(produto)" 
                      [checked]="isProductSelected(produto)">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ produto.nome }}</p>
                      <p class="text-sm text-green-600 font-semibold">{{ produto.preco | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
                      @if (produto.descricao) {
                      <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ produto.descricao }}</p>
                      }
                    </div>
                  </label>
                  }
                </div>
                }
              </div>
            </div>

            @if (selectedProducts().length > 0) {
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 class="text-sm font-semibold text-blue-900 mb-3">Produtos Selecionados ({{ selectedProducts().length }})</h4>
              <div class="space-y-2">
                @for (produto of selectedProducts(); track produto.id) {
                <div class="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                  <span class="text-sm text-gray-900">{{ produto.nome }}</span>
                  <span class="text-sm font-semibold text-green-600">{{ produto.preco | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span>
                </div>
                }
              </div>
              <div class="mt-3 pt-3 border-t border-blue-200">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-blue-900">Total:</span>
                  <span class="text-lg font-bold text-green-600">{{ totalPedido() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span>
                </div>
              </div>
            </div>
            }

            <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button 
                type="submit"
                [disabled]="loading()"
                class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2">
                @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
                } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ isNewPedido() ? 'Criar Pedido' : 'Salvar Alterações' }}
                }
              </button>
              
              <button 
                type="button" 
                (click)="goBack()"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PedidoEditComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  pedido = signal<Pedido>({ 
    cliente: '', 
    dataPedido: new Date().toISOString().slice(0, 10), 
    valorTotal: 0, 
    status: 'pendente', 
    produtoIds: [], 
    produtos: [] 
  });
  
  produtos = signal<Produto[]>([]);
  selectedProducts = signal<Produto[]>([]);
  loading = signal(false);
  error = signal('');
  success = signal('');
  isNewPedido = signal(true);

  totalPedido = computed(() => {
    return this.selectedProducts().reduce((total, produto) => total + Number(produto.preco), 0);
  });

  ngOnInit() {
    this.loadProdutos();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'novo') {
      this.isNewPedido.set(false);
      this.loadPedido(+id);
    }
  }

  loadPedido(id: number) {
    this.loading.set(true);
    this.pedidoService.findOne(id).subscribe({
      next: (pedido) => {
        const formattedDate = new Date(pedido.dataPedido).toISOString().slice(0, 10);
        this.pedido.set({
          ...pedido,
          dataPedido: formattedDate
        });
        this.selectedProducts.set(pedido.produtos || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar pedido');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadProdutos() {
    this.produtoService.findAll().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos);
      },
      error: (err) => {
        this.error.set('Erro ao carregar produtos');
        console.error(err);
      }
    });
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
  }

  isProductSelected(produto: Produto): boolean {
    return this.selectedProducts().some(p => p.id === produto.id);
  }

  savePedido() {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const currentPedido = this.pedido();
    const selectedProducts = this.selectedProducts();

    const formattedDataPedido = new Date(currentPedido.dataPedido).toISOString();
    const produtoIds = selectedProducts.map(product => product.id!);
    const valorTotal = this.totalPedido();

    const pedidoData = {
      ...currentPedido,
      dataPedido: formattedDataPedido,
      produtoIds: produtoIds,
      valorTotal: valorTotal
    };

    if (this.isNewPedido()) {
      this.pedidoService.create(pedidoData).subscribe({
        next: () => {
          this.success.set('Pedido criado com sucesso!');
          this.loading.set(false);
          setTimeout(() => this.goBack(), 1500);
        },
        error: (err) => {
          this.error.set('Erro ao criar pedido');
          this.loading.set(false);
          console.error(err);
        }
      });
    } else {
      this.pedidoService.update(currentPedido.id!, pedidoData).subscribe({
        next: () => {
          this.success.set('Pedido atualizado com sucesso!');
          this.loading.set(false);
          setTimeout(() => this.goBack(), 1500);
        },
        error: (err) => {
          this.error.set('Erro ao atualizar pedido');
          this.loading.set(false);
          console.error(err);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/pedidos']);
  }
}
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../models/produto.model';

@Component({
  selector: 'app-produto-edit',
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
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ isNewProduct() ? 'Novo Produto' : 'Editar Produto' }}</h1>
              <p class="text-gray-600">{{ isNewProduct() ? 'Adicione um novo produto ao catálogo' : 'Atualize as informações do produto' }}</p>
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
            <h2 class="text-xl font-semibold text-gray-900">Informações do Produto</h2>
            <p class="text-sm text-gray-600 mt-1">Preencha todos os campos obrigatórios</p>
          </div>

          <form (ngSubmit)="saveProduto()" class="p-6 space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Nome do Produto -->
              <div class="lg:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2" for="nome">
                  Nome do Produto <span class="text-red-500">*</span>
                </label>
                <input 
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  id="nome" 
                  type="text" 
                  [(ngModel)]="produto().nome" 
                  name="nome" 
                  placeholder="Digite o nome do produto" 
                  required>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2" for="preco">
                  Preço <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">R$</span>
                  </div>
                  <input 
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    id="preco" 
                    type="number" 
                    [(ngModel)]="produto().preco" 
                    name="preco" 
                    placeholder="0,00"
                    step="0.01" 
                    min="0" 
                    required>
                </div>
              </div>

              <div class="lg:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2" for="descricao">Descrição</label>
                <textarea 
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  id="descricao" 
                  [(ngModel)]="produto().descricao" 
                  name="descricao" 
                  placeholder="Descreva o produto (opcional)"
                  rows="4"></textarea>
              </div>
            </div>

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
                {{ isNewProduct() ? 'Criar Produto' : 'Salvar Alterações' }}
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
export class ProdutoEditComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  produto = signal<Produto>({ nome: '', descricao: '', preco: 0 });
  loading = signal(false);
  error = signal('');
  success = signal('');
  isNewProduct = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'novo') {
      this.isNewProduct.set(false);
      this.loadProduto(+id);
    }
  }

  loadProduto(id: number) {
    this.loading.set(true);
    this.produtoService.findById(id).subscribe({
      next: (produto) => {
        this.produto.set(produto);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar produto');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  saveProduto() {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const currentProduto = this.produto();

    if (this.isNewProduct()) {
      this.produtoService.create(currentProduto).subscribe({
        next: () => {
          this.success.set('Produto criado com sucesso!');
          this.loading.set(false);
          setTimeout(() => this.goBack(), 1500);
        },
        error: (err) => {
          this.error.set('Erro ao criar produto');
          this.loading.set(false);
          console.error(err);
        }
      });
    } else {
      this.produtoService.update(currentProduto.id!, currentProduto).subscribe({
        next: () => {
          this.success.set('Produto atualizado com sucesso!');
          this.loading.set(false);
          setTimeout(() => this.goBack(), 1500);
        },
        error: (err) => {
          this.error.set('Erro ao atualizar produto');
          this.loading.set(false);
          console.error(err);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/produtos']);
  }
}
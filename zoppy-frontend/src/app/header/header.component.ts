import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/assets/logo.png" alt="Logo" class="w-full h-full object-contain">
                </div>
                <div class="hidden sm:block">
                  <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sistema de Gestão
                  </h1>
                  <p class="text-xs text-gray-500">Produtos & Pedidos</p>
                </div>
              </div>
            </div>

            <nav class="flex space-x-1 sm:space-x-4">
              <a
                routerLink="/pedidos"
                routerLinkActive="bg-blue-50 text-blue-600 border-blue-200"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="hidden sm:inline">Pedidos</span>
              </a>

              <a
                routerLink="/produtos"
                routerLinkActive="bg-blue-50 text-blue-600 border-blue-200"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <span class="hidden sm:inline">Produtos</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
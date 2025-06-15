import { Component, OnInit, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { PedidoService } from '../../services/pedido.service';
import { ProdutoService } from '../../services/produto.service';
import type { Pedido } from '../../models/pedido.model';
import type { Produto } from '../../models/produto.model';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);

  totalPedidos = signal(0);
  totalProdutos = signal(0);
  totalValorPedidos = signal(0);

  pedidos: Pedido[] = [];
  produtos: Produto[] = [];

  pedidosPendentes = signal(0);
  pedidosConcluidos = signal(0);
  pedidosCancelados = signal(0);

  loading = signal(true);
  error = signal('');

  statusChart: any;
  topProductsChart: any;

  ngOnInit(): void {
    Chart.register(...registerables);
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.createStatusChart();
    this.createTopProductsChart();
  }

  async loadData(): Promise<void> {
    try {
      const pedidosResponse = await this.pedidoService.findAll().toPromise();
      this.pedidos = pedidosResponse?.rows || [];
      this.totalPedidos.set(pedidosResponse?.count || 0);

      const produtosResponse = await this.produtoService.findAll().toPromise();
      this.produtos = produtosResponse || [];
      this.totalProdutos.set(this.produtos.length);

      this.calculateTotals();
    } catch (err: any) {
      this.error.set('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      this.loading.set(false);
      setTimeout(() => { 
        this.createStatusChart();
        this.createTopProductsChart();
      }, 100);
    }
  }

  calculateTotals(): void {
    this.totalValorPedidos.set(this.pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0));

    this.pedidosPendentes.set(this.pedidos.filter(p => p.status.toLowerCase() === 'pendente').length);
    this.pedidosConcluidos.set(this.pedidos.filter(p => p.status.toLowerCase() === 'concluido').length);
    this.pedidosCancelados.set(this.pedidos.filter(p => p.status.toLowerCase() === 'cancelado').length);
  }

  createStatusChart(): void {
    const statusCounts = {
      pendente: this.pedidos.filter(p => p.status.toLowerCase() === 'pendente').length,
      concluido: this.pedidos.filter(p => p.status.toLowerCase() === 'concluido').length,
      cancelado: this.pedidos.filter(p => p.status.toLowerCase() === 'cancelado').length,
      processamento: this.pedidos.filter(p => p.status.toLowerCase() === 'em processamento').length,
    };

    const canvas: any = document.getElementById('statusChart');

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    if (canvas) {
      this.statusChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Pendentes', 'Concluídos', 'Cancelados', 'Em Processamento'],
          datasets: [{
            label: 'Status dos Pedidos',
            data: [statusCounts.pendente, statusCounts.concluido, statusCounts.cancelado, statusCounts.processamento],
            backgroundColor: [
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)' 
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14
                }
              }
            },
            title: {
              display: true,
              text: 'Distribuição dos Status dos Pedidos',
              font: {
                size: 16
              }
            }
          }
        }
      });
    } else {
      console.error("Canvas element with id 'statusChart' not found.");
    }
  }

  createTopProductsChart(): void {
    const productCounts: { [key: number]: number } = {};

    this.pedidos.forEach(pedido => {
      if (pedido.produtos) {
        pedido.produtos.forEach(produto => {
          const productId = produto.id!;
          productCounts[productId] = (productCounts[productId] || 0) + 1;
        });
      }
    });

    const sortedProductCounts = Object.entries(productCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    const topProductLabels = sortedProductCounts.map(([productId]) => {
      const product = this.produtos.find(p => p.id === Number(productId));
      return product ? product.nome : 'Unknown Product';
    });
    const topProductData = sortedProductCounts.map(([, count]) => count);

    const canvas: any = document.getElementById('topProductsChart');

    if (this.topProductsChart) {
      this.topProductsChart.destroy();
    }

    if (canvas) {
      this.topProductsChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: topProductLabels,
          datasets: [{
            label: 'Produtos Mais Vendidos',
            data: topProductData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Top 5 Produtos Mais Vendidos',
              font: {
                size: 16
              }
            }
          }
        }
      });
    } else {
      console.error("Canvas element with id 'topProductsChart' not found.");
    }
  }
}
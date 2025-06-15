import { Component, type OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../header/header.component";
import { ProdutoService } from "../../services/produto.service";
import { Produto } from "../../models/produto.model";


@Component({
  selector: "app-produtos",
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: "./produtos.component.html",
})
export class ProdutosComponent implements OnInit {
  private produtoService = inject(ProdutoService);

  produtos = signal<Produto[]>([]);
  showForm = signal(false);
  isEditing = signal(false);
  selectedProduto = signal<Produto | null>(null);
  error = signal("");

  newProduto = signal<Produto>({
    nome: "",
    descricao: "",
    preco: 0,
  });

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
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

  showCreateForm(): void {
    this.showForm.set(true);
    this.isEditing.set(false);
    this.selectedProduto.set(null);
    this.newProduto.set({ nome: "", descricao: "", preco: 0 });
  }

  showEditForm(produto: Produto): void {
    this.showForm.set(true);
    this.isEditing.set(true);
    this.selectedProduto.set(produto);
    this.newProduto.set({ ...produto });
  }

  hideForm(): void {
    this.showForm.set(false);
    this.selectedProduto.set(null);
    this.isEditing.set(false);
  }

  saveProduto(): void {
    const currentProduto = this.newProduto();

    if (this.isEditing() && this.selectedProduto()) {
      this.produtoService.update(this.selectedProduto()!.id!, currentProduto).subscribe({
        next: () => {
          this.loadProdutos();
          this.hideForm();
        },
        error: (err) => {
          this.error.set("Erro ao atualizar produto");
          console.error(err);
        },
      });
    } else {
      this.produtoService.create(currentProduto).subscribe({
        next: () => {
          this.loadProdutos();
          this.hideForm();
        },
        error: (err) => {
          this.error.set("Erro ao criar produto");
          console.error(err);
        },
      });
    }
  }

  deleteProduto(id: number): void {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      this.produtoService.remove(id).subscribe({
        next: () => {
          this.loadProdutos();
        },
        error: (err) => {
          this.error.set("Erro ao excluir produto");
          console.error(err);
        },
      });
    }
  }
}
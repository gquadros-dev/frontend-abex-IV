export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  precoCusto?: number; // Opcional porque não vem no GET, mas é necessário no POST/PUT
  precoVenda: number;
  fornecedorId: number;
}

export interface VendaItem {
  id?: number;
  produtoSkuId: number;
  quantidade: number;
  precoUnitario?: number;
}

export interface Venda {
  id?: number;
  dataVenda?: string;
  nomeCliente: string;
  valorTotal?: number;
  itens: VendaItem[];
}

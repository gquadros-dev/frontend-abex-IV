export interface ProdutoSku {
    id: number;
    produtoId: number;
    produtoVariationId1: number;
    produtoVariationId2: number | null;
    descricao: string;
    precoVenda: number;
}


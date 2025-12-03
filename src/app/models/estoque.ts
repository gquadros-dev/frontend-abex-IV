export interface Estoque {
    produtoSkuId: number;
    quantidadeAtual: number;
    ativo: boolean;
    excluido: boolean;
    criadoEm: string;
    atualizadoEm: string;
    produtoSku: any | null;
}


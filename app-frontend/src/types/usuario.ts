export type Usuario = {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    tipo_usuario: 'Cliente' | 'Analista' | 'Gestor';
    empresa: string;
    nist_maturidade: boolean;
    is_active?: boolean;
    data_criacao?: string;
    permissoes: string[];
};
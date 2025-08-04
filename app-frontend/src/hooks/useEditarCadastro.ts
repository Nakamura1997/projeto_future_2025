import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Usuario } from '@/types/usuario';

export const useEditarCadastro = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const buscarUsuario = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/usuarios/${id}`);
            if (!response.ok) throw new Error('Erro ao buscar usuário');
            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const atualizarUsuario = async (id: string, dados: Partial<Usuario>) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const response = await fetch(`/api/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao atualizar usuário');
            }

            setSuccess(true);
            return { success: true };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { buscarUsuario, atualizarUsuario, loading, error, success };
};
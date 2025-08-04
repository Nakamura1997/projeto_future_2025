'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDefinirSenha } from '@/hooks/useDefinirSenha';
import Image from 'next/image';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import fs3mLogo from '@/assets/f3smlogo.png';
import logoGRande from '@/assets/Logo Vertical - Branco.png';

export default function Page() {
  const params = useParams();
  const token = params?.token as string;

  const [isMobile, setIsMobile] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const { definirSenha, loading, error, success } = useDefinirSenha();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (success) {
      alert('Senha definida com sucesso. Você será redirecionado para o login.');
      router.push('/login');
    }
  }, [success, router]);

  // Função para validar a força da senha
  const validarSenha = (senha: string): string | null => {
    if (senha.length < 6) {
      return 'A senha deve ter no mínimo 6 caracteres';
    }
    if (!/[A-Z]/.test(senha)) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
      return 'A senha deve conter pelo menos um caractere especial';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Resetar erros anteriores
    setErroValidacao(null);

    // Validar força da senha
    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      setErroValidacao(erroSenha);
      return;
    }

    if (senha !== confirmarSenha) {
      setErroValidacao('As senhas não coincidem');
      return;
    }

    await definirSenha(token, senha);
  };

  return (
    <main className="login-main-container">
      <div className={`login-container ${isMobile ? 'mobile' : ''}`}>
        <section className="form-section">
          <Image className="logo-pequeno" src={fs3mLogo} alt="logo fs3m" />
          <div className="brand-header">
            <h1>
              <span className="letter">F</span>
              <span className="letter">S</span>
              <span className="letter-3">3</span>
              <span className="letter">M</span>
            </h1>
            <p className="system-description">Future Security Maturity Monitoring & Management</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={mostrarConfirmarSenha ? 'text' : 'password'}
                placeholder="Confirme a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="password-requirements">
              <p>A senha deve conter:</p>
              <ul>
                <li className={senha.length >= 6 ? 'valid' : ''}>Mínimo 6 caracteres</li>
                <li className={/[A-Z]/.test(senha) ? 'valid' : ''}>1 letra maiúscula</li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(senha) ? 'valid' : ''}>
                  1 caractere especial
                </li>
              </ul>
            </div>

            {(erroValidacao || error) && <p className="error-message">{erroValidacao || error}</p>}
            {success && <p className="success-message">Senha definida com sucesso!</p>}

            <div className="divider"></div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Definindo...' : 'Definir Senha'}
            </button>
          </form>
        </section>

        {!isMobile && (
          <section className="brand-section">
            <Image className="logo-direita" src={logoGRande} alt="logo da future" />
          </section>
        )}
      </div>
    </main>
  );
}

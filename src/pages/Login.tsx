import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../controller/api';
import '../styles/login.css';
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para a mensagem de erro
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores
    try {
      const response = await api.post('/login', { email, password });
      console.log(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Email ou senha inválidos. Tente novamente.'); // Define a mensagem de erro
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo da Clínica" />
        <h1>Clínica Acolher</h1>
        <p>Faça login para continuar</p>

        <select>
          <option value="">Selecione o cargo</option>
          <option value="diretor">Diretor geral</option>
          <option value="recepcionista">Recepcionista</option>
          <option value="profissional">Profissional de saúde</option>
        </select>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro */}

          <div className="login-actions">
            <label>
              <input type="checkbox" /> Lembrar de mim
            </label>
            <a href="#">Esqueceu sua senha?</a>
          </div>

          <button className="login-button" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

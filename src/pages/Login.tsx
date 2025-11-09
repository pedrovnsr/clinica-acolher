import '../styles/login.css';
import logo from '../assets/logo.png';

export default function Login() {
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

        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />

        <div className="login-actions">
          <label>
            <input type="checkbox" /> Lembrar de mim
          </label>
          <a href="#">Esqueceu sua senha?</a>
        </div>

        <button className="login-button">Entrar</button>
      </div>
    </div>
  );
}

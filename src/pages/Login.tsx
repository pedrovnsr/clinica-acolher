import '../styles/login.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import {login} from '../controller/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  function handleChange(event : any) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleLogin(event : any) {
    event.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token);
      console.log('Login bem-sucedido:', response.data);
      window.location.href = "/dashboard";
    }
    catch (error) {
      console.error('Erro no login:', error);
    }
  }

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

        <input type="email" placeholder="E-mail" onChange={handleChange} name='email'/>
        <input type="password" placeholder="Senha" onChange={handleChange} name='password'/>

        <div className="login-actions">
          <label>
            <input type="checkbox" /> Lembrar de mim
          </label>
          <a href="#">Esqueceu sua senha?</a>
        </div>

        <button className="login-button" onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );
}

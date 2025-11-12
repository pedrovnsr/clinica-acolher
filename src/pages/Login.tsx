import '../styles/login.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import {login} from '../controller/api';
import { setCurrentUser } from '../utils/auth';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [role, setRole] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token);

      // create a small user object so the UI can know role/profissionalId
      const user = {
        name: formData.email.split('@')[0],
        role: role, // diretor | recepcionista | profissional
        profissionalId: role === 'profissional' ? formData.email : undefined,
      };

      setCurrentUser(user);

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

        <select value={role} onChange={(e) => setRole(e.target.value)}>
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

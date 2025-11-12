import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Professionals.css";
import { FaBell } from "react-icons/fa";



const Professionals: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    rg: "",
    telefone: "",
    speciality: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Máscaras simples
    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    if (name === "telefone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2");
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "Campo obrigatório";
    });

    // Validações extras
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (formData.cpf && formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido";
    }

    if (formData.telefone && formData.telefone.replace(/\D/g, "").length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSuccess("");
      return;
    }

    setSuccess("Profissional cadastrado com sucesso!");
    setErrors({});

    // Limpa o formulário
    setFormData({
      name: "",
      email: "",
      password: "",
      cpf: "",
      rg: "",
      telefone: "",
      speciality: "",
    });

    // Aqui você pode chamar o backend futuramente
    // Ex: await api.post("/professionals", formData)
  };

  return (

    <div className="professionals-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="professionals-main">
        {/* Header */}
        <header className="professionals-header">
          <h1 className="page-title">Cadastro de Profissionais</h1>

          <div className="header-right">
            <FaBell className="notification-icon" />
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">Dra. Anne Caroline</span>
                <span className="user-role">Diretora</span>
              </div>
              <div className="user-photo">Photo</div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <section className="professionals-content">
          <form className="professional-form" onSubmit={handleSubmit}>
            {success && <p className="success-message">{success}</p>}

            {/* Inputs */}
            {[
              { id: "name", label: "Nome completo" },
              { id: "email", label: "E-mail" },
              { id: "password", label: "Senha", type: "password" },
              { id: "cpf", label: "CPF" },
              { id: "rg", label: "RG" },
              { id: "telefone", label: "Telefone" },
              { id: "speciality", label: "Especialidade" },
            ].map(({ id, label, type }) => (
              <div className="form-group" key={id}>
                <label htmlFor={id}>{label}</label>
                <input
                  type={type || "text"}
                  id={id}
                  name={id}
                  value={formData[id as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={`Digite o ${label.toLowerCase()}`}
                />
                {errors[id] && <span className="error-message">{errors[id]}</span>}
              </div>
            ))}

            <button type="submit" className="submit-button">
              Cadastrar profissional
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Professionals;

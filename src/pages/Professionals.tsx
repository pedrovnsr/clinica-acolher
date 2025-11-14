import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Professionals.css";
import NotificationHeader from "../components/NotificationHeader";
import { professionalRegistration } from "../controller/api";

const strongPasswordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,]).{8,}$/;

function isValidPassword(password: string) {
  return strongPasswordRegex.test(password);
}

interface FormData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  rg: string;
  telefone: string;
  role: string;
  speciality: string;
  professionalRegister: string;
  userType: string;
}

const Professionals: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    cpf: "",
    rg: "",
    telefone: "",
    role: "",
    speciality: "",
    professionalRegister: "",
    userType: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // -----------------------------
  // Máscaras
  // -----------------------------
  const formatCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatTelefone = (tel: string) =>
    tel
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");

  // -----------------------------
  // HandleChange — userType seguindo o backend
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let formatted = value;
    if (name === "cpf") formatted = formatCPF(value);
    if (name === "telefone") formatted = formatTelefone(value);

    setFormData((prev) => {
      const newData = { ...prev, [name]: formatted };

      if (name === "role") {
        // Backend aceita APENAS estes valores:
        // RECEPCIONIST, PROFESSIONAL, GENERAL_DIRECTOR

        if (value === "PROFESSIONAL") newData.userType = "PROFESSIONAL";
        else if (value === "RECEPCIONIST") newData.userType = "RECEPCIONIST";
        else if (value === "DIRECTOR") newData.userType = "GENERAL_DIRECTOR";
        else newData.userType = "";
      }

      return newData;
    });
  };

  // -----------------------------
  // Validação
  // -----------------------------
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const required = ["name", "email", "password", "cpf", "rg", "telefone", "role"];

    required.forEach((f) => {
      if (!formData[f as keyof FormData].trim()) {
        newErrors[f] = "Campo obrigatório";
      }
    });

    if (formData.role === "PROFESSIONAL") {
      if (!formData.speciality.trim()) newErrors.speciality = "Especialidade obrigatória";
      if (!formData.professionalRegister.trim())
        newErrors.professionalRegister = "Registro obrigatório";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "E-mail inválido";

    if (formData.cpf.replace(/\D/g, "").length !== 11)
      newErrors.cpf = "CPF inválido";

    const tel = formData.telefone.replace(/\D/g, "");
    if (tel.length < 10 || tel.length > 11) newErrors.telefone = "Telefone inválido";

    if (formData.password.length < 8)
      newErrors.password = "A senha deve ter ao menos 8 caracteres";
    else if (!isValidPassword(formData.password))
      newErrors.password =
        "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      await professionalRegistration(formData);

      setSuccess("Profissional cadastrado com sucesso!");
      setFormData({
        name: "",
        email: "",
        password: "",
        cpf: "",
        rg: "",
        telefone: "",
        role: "",
        speciality: "",
        professionalRegister: "",
        userType: "",
      });
    } catch {
      setErrors({ submit: "Erro ao cadastrar. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="professionals-container">
      <Sidebar />

      <div className="professionals-main">
        <div className="patients-header">
          <h1>Cadastro de profissional</h1>
          <NotificationHeader />
        </div>

        <section className="professionals-content">
          <form className="professional-form" onSubmit={handleSubmit}>
            {success && <p className="success-message">{success}</p>}
            {errors.submit && <p className="error-message">{errors.submit}</p>}

            {/* Nome */}
            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome completo"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite o e-mail"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Senha */}
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite a senha"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* CPF */}
            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="Digite o CPF"
              />
              {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            </div>

            {/* RG */}
            <div className="form-group">
              <label>RG</label>
              <input
                type="text"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
                placeholder="Digite o RG"
              />
              {errors.rg && <span className="error-message">{errors.rg}</span>}
            </div>

            {/* TELEFONE */}
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Digite o telefone"
              />
              {errors.telefone && <span className="error-message">{errors.telefone}</span>}
            </div>

            {/* ROLE */}
            <div className="form-group">
              <label>Cargo</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Selecione um cargo</option>
                <option value="DIRECTOR">Diretor Geral</option>
                <option value="RECEPCIONIST">Recepcionista</option>
                <option value="PROFESSIONAL">Profissional</option>
              </select>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            {/* Campos extra para PROFESSIONAL */}
            {formData.role === "PROFESSIONAL" && (
              <>
                <div className="form-group">
                  <label>Especialidade</label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                    placeholder="Digite a especialidade"
                  />
                  {errors.speciality && (
                    <span className="error-message">{errors.speciality}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Registro Profissional</label>
                  <input
                    type="text"
                    name="professionalRegister"
                    value={formData.professionalRegister}
                    onChange={handleChange}
                    placeholder="Digite o registro profissional"
                  />
                  {errors.professionalRegister && (
                    <span className="error-message">
                      {errors.professionalRegister}
                    </span>
                  )}
                </div>
              </>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar profissional"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Professionals;

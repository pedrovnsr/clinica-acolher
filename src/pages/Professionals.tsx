import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Professionals.css";
import NotificationHeader from "../components/NotificationHeader";
import { professionalRegistration } from "../controller/api";

const Professionals: React.FC = () => {
  const strongPasswordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,]).{8,}$/;

  function isValidPassword(password: string) {
    return strongPasswordRegex.test(password);
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    rg: "",
    telefone: "",
    role: "",
    speciality: "",
    professionalRegister: "",
    userType: "PROFESSIONAL",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

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

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: formattedValue };

      if (name === "role") {
        if (value === "PROFESSIONAL") {
          newFormData.userType = "PROFESSIONAL";
        } else if (value === "RECEPTIONIST") {
          newFormData.userType = "RECEPTIONIST";
        } else if (value === "DIRECTOR") {
          newFormData.userType = "DIRECTOR";
        }
        // Limpa os campos de profissional se o cargo não for profissional
        if (value !== "PROFESSIONAL") {
          newFormData.speciality = "";
          newFormData.professionalRegister = "";
        }
      }

      return newFormData;
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        // Campos que não são obrigatórios para todos
        if (
          (key === "speciality" || key === "professionalRegister") &&
          formData.role !== "PROFESSIONAL"
        ) {
          return;
        }
        newErrors[key] = "Campo obrigatório";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (formData.cpf && formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido";
    }

    if (formData.telefone && formData.telefone.replace(/\D/g, "").length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    if (formData.role === "PROFESSIONAL") {
      if (!formData.speciality.trim()) {
        newErrors.speciality = "Especialidade é obrigatória para profissionais";
      }
      if (!formData.professionalRegister.trim()) {
        newErrors.professionalRegister =
          "Registro profissional é obrigatório para profissionais";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleRegistration() {
    try {
      const response = await professionalRegistration(formData);
      console.log("Profissional cadastrado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar profissional:", error);
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setErrors({
        ...errors,
        password: "A senha deve ter no mínimo 8 caracteres",
      });
      return;
    }

    if (!isValidPassword(formData.password)) {
      setErrors({
        ...errors,
        password:
          "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.",
      });
      return;
    }

    if (!validateForm()) {
      setSuccess("");
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      await handleRegistration();
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
        userType: "PROFESSIONAL",
      });
    } catch {
      setErrors({
        submit: "Erro ao cadastrar profissional. Tente novamente.",
      });
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

            <div className="form-group">
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome completo"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite o e-mail"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite a senha"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="Digite o CPF"
              />
              {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rg">RG</label>
              <input
                type="text"
                id="rg"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
                placeholder="Digite o RG"
              />
              {errors.rg && <span className="error-message">{errors.rg}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Digite o telefone"
              />
              {errors.telefone && (
                <span className="error-message">{errors.telefone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role">Cargo</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Selecione um cargo</option>
                <option value="DIRECTOR">Diretor Geral</option>
                <option value="RECEPTIONIST">Recepcionista</option>
                <option value="PROFESSIONAL">Profissional</option>
              </select>
              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>

            {formData.role === "PROFESSIONAL" && (
              <>
                <div className="form-group">
                  <label htmlFor="speciality">Especialidade</label>
                  <input
                    type="text"
                    id="speciality"
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
                  <label htmlFor="professionalRegister">
                    Registro Profissional
                  </label>
                  <input
                    type="text"
                    id="professionalRegister"
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

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar profissional"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Professionals;

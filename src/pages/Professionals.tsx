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
    speciality: "",
    userType: "PROFESSIONAL",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setFormData({ ...formData, [name]: formattedValue });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "Campo obrigatório";
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
        speciality: "",
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
                {errors[id] && (
                  <span className="error-message">{errors[id]}</span>
                )}
              </div>
            ))}

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

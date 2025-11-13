import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NotificationHeader from "../components/NotificationHeader";
import "../styles/Patients.css";
import { patientRegistration, patientGuardianRegistration } from "../controller/api";

const Patients: React.FC = () => {
  const [isDependent, setIsDependent] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formDatapatient, setFormDataPatient] = useState({
    name: "",
    sex: "",
    birthDate: "",
    cpf: "",
    rg: "",
    telefone: "",
    email: "",
    isDependent: false,
    guardianId: null,
  });

  const [formDataGuardian, setFormDataGuardian] = useState({
    name: "",
    cpf: "",
    rg: "",
    relationship: "",
    telephone: "",
    email: "",
  });

  // Handlers
  function handlePatientChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormDataPatient((prev) => ({ ...prev, [name]: value }));
  }

  function handleGuardianChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormDataGuardian((prev) => ({ ...prev, [name]: value }));
  }

  // Validação
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formDatapatient.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!formDatapatient.sex) newErrors.sex = "Selecione o sexo.";
    if (!formDatapatient.birthDate) newErrors.birthDate = "Informe a data de nascimento.";
    if (!formDatapatient.cpf.trim()) newErrors.cpf = "CPF é obrigatório.";
    if (!formDatapatient.telefone.trim()) newErrors.telefone = "Telefone é obrigatório.";
    if (!formDatapatient.email.trim()) newErrors.email = "E-mail é obrigatório.";

    if (isDependent) {
      if (!formDataGuardian.name.trim()) newErrors.guardianName = "Nome do responsável é obrigatório.";
      if (!formDataGuardian.cpf.trim()) newErrors.guardianCpf = "CPF do responsável é obrigatório.";
      if (!formDataGuardian.relationship.trim()) newErrors.relationship = "Parentesco é obrigatório.";
      if (!formDataGuardian.telephone.trim()) newErrors.guardianPhone = "Telefone do responsável é obrigatório.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateFields()) {
      console.warn("Há campos obrigatórios não preenchidos.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isDependent) {
        const { data: guardian } = await patientGuardianRegistration(formDataGuardian);
        const guardianId = guardian?.id;

        const patientDataWithGuardian = {
          ...formDatapatient,
          isDependent: true,
          guardianId,
        };

        await patientRegistration(patientDataWithGuardian);
        alert("Paciente e responsável cadastrados com sucesso!");
      } else {
        await patientRegistration(formDatapatient);
        alert("Paciente cadastrado com sucesso!");
      }

      // Limpar formulário
      setFormDataPatient({
        name: "",
        sex: "",
        birthDate: "",
        cpf: "",
        rg: "",
        telefone: "",
        email: "",
        isDependent: false,
        guardianId: null,
      });
      setFormDataGuardian({
        name: "",
        cpf: "",
        rg: "",
        relationship: "",
        telephone: "",
        email: "",
      });
      setIsDependent(false);
      setErrors({});
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Ocorreu um erro ao cadastrar o paciente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="patients-container">
      <Sidebar />

      <main className="patients-main">
        <div className="patients-header">
          <h1>Cadastro de pacientes</h1>
          <NotificationHeader />
        </div>

        <form className="patients-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome completo *</label>
            <input
              type="text"
              name="name"
              value={formDatapatient.name}
              placeholder="Digite o nome completo"
              onChange={handlePatientChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <small className="error-text">{errors.name}</small>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sexo *</label>
              <select
                name="sex"
                value={formDatapatient.sex}
                onChange={handlePatientChange}
                className={errors.sex ? "error" : ""}
              >
                <option value="" disabled>Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
              {errors.sex && <small className="error-text">{errors.sex}</small>}
            </div>

            <div className="form-group">
              <label>Data de nascimento *</label>
              <input
                type="date"
                name="birthDate"
                value={formDatapatient.birthDate}
                onChange={handlePatientChange}
                className={errors.birthDate ? "error" : ""}
              />
              {errors.birthDate && <small className="error-text">{errors.birthDate}</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CPF *</label>
              <input
                type="text"
                name="cpf"
                value={formDatapatient.cpf}
                placeholder="Digite o CPF"
                onChange={handlePatientChange}
                className={errors.cpf ? "error" : ""}
              />
              {errors.cpf && <small className="error-text">{errors.cpf}</small>}
            </div>

            <div className="form-group">
              <label>RG</label>
              <input
                type="text"
                name="rg"
                value={formDatapatient.rg}
                placeholder="Digite o RG"
                onChange={handlePatientChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telefone *</label>
              <input
                type="text"
                name="telefone"
                value={formDatapatient.telefone}
                placeholder="Digite o telefone"
                onChange={handlePatientChange}
                className={errors.telefone ? "error" : ""}
              />
              {errors.telefone && <small className="error-text">{errors.telefone}</small>}
            </div>

            <div className="form-group">
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                value={formDatapatient.email}
                placeholder="Digite o e-mail"
                onChange={handlePatientChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isDependent"
              checked={isDependent}
              onChange={(e) => setIsDependent(e.target.checked)}
            />
            <label htmlFor="isDependent">O paciente possui responsável?</label>
          </div>

          {isDependent && (
            <div className="responsavel-section">
              <h2>Informações do responsável</h2>

              <div className="form-group">
                <label>Nome completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formDataGuardian.name}
                  placeholder="Digite o nome"
                  onChange={handleGuardianChange}
                  className={errors.guardianName ? "error" : ""}
                />
                {errors.guardianName && <small className="error-text">{errors.guardianName}</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formDataGuardian.cpf}
                    placeholder="Digite o CPF"
                    onChange={handleGuardianChange}
                    className={errors.guardianCpf ? "error" : ""}
                  />
                  {errors.guardianCpf && <small className="error-text">{errors.guardianCpf}</small>}
                </div>

                <div className="form-group">
                  <label>RG</label>
                  <input
                    type="text"
                    name="rg"
                    value={formDataGuardian.rg}
                    placeholder="Digite o RG"
                    onChange={handleGuardianChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Parentesco *</label>
                  <input
                    type="text"
                    name="relationship"
                    value={formDataGuardian.relationship}
                    placeholder="Digite o parentesco"
                    onChange={handleGuardianChange}
                    className={errors.relationship ? "error" : ""}
                  />
                  {errors.relationship && <small className="error-text">{errors.relationship}</small>}
                </div>

                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="text"
                    name="telephone"
                    value={formDataGuardian.telephone}
                    placeholder="Digite o telefone"
                    onChange={handleGuardianChange}
                    className={errors.guardianPhone ? "error" : ""}
                  />
                  {errors.guardianPhone && <small className="error-text">{errors.guardianPhone}</small>}
                </div>
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formDataGuardian.email}
                  placeholder="Digite o e-mail"
                  onChange={handleGuardianChange}
                />
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar paciente"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Patients;

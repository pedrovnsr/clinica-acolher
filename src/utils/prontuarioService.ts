export type Prontuario = {
  pacienteId: string; // unique identifier for patient (e.g., cpf or id)
  pacienteNome: string;
  dataConsulta: string;
  observacoes: string;
  pdfBase64?: string; // optional uploaded PDF as base64
};

// Structure stored in localStorage: { [profissionalId]: Prontuario[] }
const STORAGE_KEY = 'app_prontuarios_by_profissional';

function readAll(): Record<string, Prontuario[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Prontuario[]>;
  } catch (e) {
    console.error('Erro ao ler prontuarios', e);
    return {};
  }
}

function writeAll(data: Record<string, Prontuario[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProntuariosForProfissional(profissionalId: string): Prontuario[] {
  const all = readAll();
  return all[profissionalId] || [];
}

export function saveProntuarioForProfissional(profissionalId: string, prontuario: Prontuario) {
  const all = readAll();
  const list = all[profissionalId] || [];
  const idx = list.findIndex(p => p.pacienteId === prontuario.pacienteId);
  if (idx >= 0) {
    list[idx] = prontuario;
  } else {
    list.push(prontuario);
  }
  all[profissionalId] = list;
  writeAll(all);
}

export function deleteProntuarioForProfissional(profissionalId: string, pacienteId: string) {
  const all = readAll();
  const list = all[profissionalId] || [];
  const filtered = list.filter(p => p.pacienteId !== pacienteId);
  all[profissionalId] = filtered;
  writeAll(all);
}

// Helper to ensure some mock data for better UX during development
export function ensureMockData(profissionalId: string) {
  const all = readAll();
  if (!all[profissionalId] || all[profissionalId].length === 0) {
    all[profissionalId] = [
      {
        pacienteId: 'joao.silva',
        pacienteNome: 'João Silva',
        dataConsulta: '11/12/2025',
        observacoes: 'Paciente apresentou sintomas de ansiedade. Recomendado acompanhamento semanal.',
      },
      {
        pacienteId: 'maria.santos',
        pacienteNome: 'Maria Santos',
        dataConsulta: '05/11/2025',
        observacoes: 'Retorno para avaliação de progresso. Medicamento estabilizado.',
      }
    ];
    writeAll(all);
  }
}


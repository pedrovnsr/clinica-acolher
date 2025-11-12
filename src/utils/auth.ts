// utilitário simples para obter/guardar o usuário no localStorage
export type AppUser = {
  name?: string;
  role?: string; // 'diretor' | 'recepcionista' | 'profissional'
  profissionalId?: string; // identificador único para o profissional (email, id, etc.)
};

export function getCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch (e) {
    console.error('Erro ao ler usuário do localStorage', e);
    return null;
  }
}

export function setCurrentUser(user: AppUser) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem('user');
}


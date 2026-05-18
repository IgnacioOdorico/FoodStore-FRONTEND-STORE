import { apiFetch } from '../../../shared/services/api';
import type { IUser } from '../../../shared/types/auth.types';

const MOCK_USERS: IUser[] = [
  { id: 1, name: "Admin", email: "admin@app.com", role: "admin" },
  { id: 2, name: "Empleado", email: "emp@app.com", role: "employee" },
  { id: 3, name: "Cliente", email: "client@app.com", role: "client" },
];

export const authService = {
  login: async (email: string): Promise<IUser> => {
    try {
      return await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }) as IUser;
    } catch {
      const mock = MOCK_USERS.find(u => u.email === email);
      if (mock) return mock;
      throw new Error('Credenciales inválidas');
    }
  },
};

// /app/services/userService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/v1/users'; // URL do seu back-end Spring Boot

export interface User {
  nome: string;
  email: string;
  status: 'ATIVO' | 'INATIVO';
  dataCriacao?: string;
}


export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const res = await axios.get(`${API_URL}/by-email?email=${email}`);
  return res.data;
};

export const createUser = async (user: User): Promise<void> => {
  await axios.post(API_URL, user);
};

export const updateUser = async (email: string, user: Partial<User>): Promise<void> => {
  await axios.put(`${API_URL}/${email}`, user);
};

export const deleteUser = async (email: string): Promise<void> => {
  await axios.delete(`${API_URL}/${email}`);
};

export const importCsv = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(`${API_URL}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (res.status !== 200) {
    throw new Error('Falha ao importar arquivo.');
  }
};

export const exportCsv = async (): Promise<void> => {
  const res = await axios.get(`${API_URL}/export`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  const fileName = `usuarios_export_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-')}.csv`;

  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

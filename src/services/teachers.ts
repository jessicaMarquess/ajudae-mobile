import { Teacher } from "@/src/types";
import { apiClient } from "./api";

const api = apiClient.getAxiosInstance();

export const teacherService = {
  // Listar professores
  async getTeachers(page = 1, pageSize = 10, search?: string) {
    const params: any = { page, pageSize };
    if (search) {
      params.search = search;
    }
    const response = await api.get<Teacher[]>("/users/professores", {
      params,
    });
    return {
      data: response.data,
      pagination: {
        page,
        pageSize,
        total: response.data.length,
      },
    };
  },

  // Obter professor específico
  async getTeacher(id: string) {
    const response = await api.get<Teacher>(`/users/${id}`);
    return response.data;
  },

  // Criar novo professor
  async createTeacher(data: {
    email: string;
    name: string;
    password: string;
    subject?: string;
    department?: string;
  }) {
    const response = await api.post<Teacher>("/users", {
      email: data.email,
      name: data.name,
      password: data.password,
      role: "professor",
    });
    return response.data;
  },

  // Atualizar professor
  async updateTeacher(
    id: string,
    data: {
      name?: string;
      subject?: string;
      department?: string;
    }
  ) {
    const response = await api.patch<Teacher>(`/users/${id}`, {
      name: data.name,
    });
    return response.data;
  },

  // Deletar professor
  async deleteTeacher(id: string) {
    console.log("[TeacherService] Deletando professor:", id);
    const response = await api.delete(`/users/${id}`);
    console.log("[TeacherService] Resposta delete:", response);
    return { success: true };
  },
};

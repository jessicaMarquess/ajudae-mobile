import { Student } from "@/src/types";
import { apiClient } from "./api";

const api = apiClient.getAxiosInstance();

export const studentService = {
  // Listar estudantes
  async getStudents(page = 1, pageSize = 10, search?: string) {
    const params: any = { page, pageSize };
    if (search) {
      params.search = search;
    }
    const response = await api.get<Student[]>("/users/alunos", {
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

  // Obter estudante específico
  async getStudent(id: string) {
    const response = await api.get<Student>(`/users/${id}`);
    return response.data;
  },

  // Criar novo estudante
  async createStudent(data: {
    email: string;
    name: string;
    password: string;
    registration?: string;
    course?: string;
  }) {
    const response = await api.post<Student>("/users", {
      email: data.email,
      name: data.name,
      password: data.password,
      role: "aluno",
    });
    return response.data;
  },

  // Atualizar estudante
  async updateStudent(
    id: string,
    data: {
      name?: string;
      registration?: string;
      course?: string;
    }
  ) {
    const response = await api.patch<Student>(`/users/${id}`, {
      name: data.name,
    });
    return response.data;
  },

  // Deletar estudante
  async deleteStudent(id: string) {
    console.log("[StudentService] Deletando estudante:", id);
    const response = await api.delete(`/users/${id}`);
    console.log("[StudentService] Resposta delete:", response);
    return { success: true };
  },
};

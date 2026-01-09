export interface User {
  id: string;
  email: string;
  name: string;
  role: "professor" | "student";
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  description: string;
  author: User | string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User | string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  email: string;
  name: string;
  subject?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  email: string;
  name: string;
  registration?: string;
  course?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

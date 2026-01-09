import { Comment, PaginatedResponse, Post } from "@/src/types";
import { apiClient } from "./api";

const api = apiClient.getAxiosInstance();

export const postService = {
  async getPosts(page = 1, pageSize = 10, search?: string) {
    const params: any = { page, pageSize };
    if (search) {
      params.search = search;
    }
    const response = await api.get<Post[]>("/posts", {
      params,
    });
    return response.data;
  },

  async getPost(id: string) {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  async createPost(data: { title: string; content: string }) {
    const response = await api.post<Post>("/posts", data);
    return response.data;
  },

  async updatePost(id: string, data: { title: string; content: string }) {
    const response = await api.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: string) {
    console.log("[PostService] Deletando post:", id);
    const response = await api.delete(`/posts/${id}`);
    console.log("[PostService] Resposta delete:", response);
    return { success: true };
  },

  async getComments(postId: string, page = 1, pageSize = 10) {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/posts/${postId}/comments`,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  },

  async addComment(postId: string, content: string) {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, {
      content,
    });
    return response.data;
  },

  async deleteComment(postId: string, commentId: string) {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  },
};

import { postService } from "@/src/services/posts";
import { studentService } from "@/src/services/students";
import { teacherService } from "@/src/services/teachers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Posts hooks
export const useGetPosts = (page = 1, pageSize = 10, search?: string) => {
  return useQuery({
    queryKey: ["posts", page, pageSize, search],
    queryFn: () => postService.getPosts(page, pageSize, search),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos (cache)
    refetchOnWindowFocus: false,
  });
};

export const useGetPost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 60, // 1 hora
    refetchOnWindowFocus: false,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      postService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      postService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// Teachers hooks
export const useGetTeachers = (page = 1, pageSize = 10, search?: string) => {
  return useQuery({
    queryKey: ["teachers", page, pageSize, search],
    queryFn: () => teacherService.getTeachers(page, pageSize, search),
  });
};

export const useGetTeacher = (id: string) => {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => teacherService.getTeacher(id),
    enabled: !!id,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      email: string;
      name: string;
      password: string;
      subject?: string;
      department?: string;
    }) => teacherService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useUpdateTeacher = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      subject?: string;
      department?: string;
    }) => teacherService.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teacherService.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

// Students hooks
export const useGetStudents = (page = 1, pageSize = 10, search?: string) => {
  return useQuery({
    queryKey: ["students", page, pageSize, search],
    queryFn: () => studentService.getStudents(page, pageSize, search),
  });
};

export const useGetStudent = (id: string) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => studentService.getStudent(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      email: string;
      name: string;
      password: string;
      registration?: string;
      course?: string;
    }) => studentService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name?: string;
      registration?: string;
      course?: string;
    }) => studentService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

import { useAuth } from "@/src/contexts/AuthContext";
import { useDeletePost, useGetPost } from "@/src/hooks/useQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { data: post, isLoading } = useGetPost(id as string);
  const deletePostMutation = useDeletePost();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleEdit = () => {
    const canManage = !!post && user?.role === "professor" && user?.id === post.authorId;
    if (canManage) {
      router.push(`/post/edit/${post.id}`);
    } else {
      Alert.alert("Erro", "Você não tem permissão para editar este post");
    }
  };

  const handleDelete = () => {
    const canManage = !!post && user?.role === "professor" && user?.id === post.authorId;
    if (canManage) {
      setDeleteModalVisible(true);
    } else {
      Alert.alert("Erro", "Você não tem permissão para deletar este post");
    }
  };

  const confirmDelete = async () => {
    if (!post) return;
    try {
      await deletePostMutation.mutateAsync(post.id);
      setDeleteModalVisible(false);
      router.back();
    } catch (error: any) {
      console.log("Erro ao deletar:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.topHeader}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
          </Pressable>
          <Text style={styles.topHeaderTitle}>Post</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#7fb069" />
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Post não encontrado</Text>
      </View>
    );
  }

  const canManage = user?.role === "professor" && user?.id === post.authorId;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
        </Pressable>
        <Text style={styles.topHeaderTitle}>Post</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.author}>
              Por:{" "}
              {typeof post.author === "string"
                ? post.author
                : post.author?.name}
            </Text>
            <Text style={styles.date}>
              {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{post.content}</Text>
        </View>

        {canManage && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteButtonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de Confirmação de Delete */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar exclusão</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja deletar este post?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Deletar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e8ddd0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a3f35",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f7f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e8ddd0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4a3f35",
    marginBottom: 12,
  },
  meta: {
    gap: 6,
  },
  author: {
    fontSize: 13,
    color: "#8b7355",
  },
  date: {
    fontSize: 12,
    color: "#a99678",
  },
  content: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e8ddd0",
  },
  description: {
    fontSize: 15,
    color: "#4a3f35",
    lineHeight: 22,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e8ddd0",
    marginVertical: 16,
  },
  fullContent: {
    fontSize: 14,
    color: "#4a3f35",
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f5faf3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7fb069",
  },
  editButtonText: {
    color: "#4a3f35",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#fef5f3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d17a6b",
  },
  deleteButtonText: {
    color: "#4a3f35",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#8b7355",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4a3f35",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#8b7355",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderColor: "#7fb069",
    backgroundColor: "#f5faf3",
  },
  cancelButtonText: {
    color: "#7fb069",
    fontWeight: "600",
    fontSize: 14,
  },
});

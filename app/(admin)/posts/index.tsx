import { useAuth } from "@/src/contexts/AuthContext";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useDeletePost, useGetPosts } from "@/src/hooks/useQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminPostsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchText, 300);
  const { data, isLoading, refetch, isFetching } = useGetPosts(
    currentPage,
    10,
    debouncedSearch || undefined
  );
  const deletePostMutation = useDeletePost();

  const isTeacher = user?.role === "professor";

  const handleEdit = (id: string) => {
    router.push(`/post/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setSelectedDeleteId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await deletePostMutation.mutateAsync(selectedDeleteId);
      setDeleteModalVisible(false);
      setSelectedDeleteId(null);
    } catch (error: any) {
      console.log("Erro ao deletar:", error);
    }
  };

  const handleView = (id: string) => {
    router.push(`/post/${id}`);
  };

  const handleNavigateHome = () => {
    setMenuVisible(false);
    router.replace("/(tabs)");
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const renderPostItem = ({ item }: any) => (
    <View style={styles.postCard}>
      <View style={styles.postInfo}>
        <Text style={styles.postTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.postAuthor}>
          Por:{" "}
          {typeof item.author === "string" ? item.author : item.author?.name}
        </Text>
        <Text style={styles.postDescription} numberOfLines={1}>
          {item.content}
        </Text>
        <Text style={styles.postDate}>
          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>
      <View style={styles.postActions}>
        {isTeacher && (
          <>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleView(item.id)}
            >
              <MaterialIcons name="visibility" size={20} color="#7fb069" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item.id)}
            >
              <MaterialIcons name="edit" size={20} color="#7fb069" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete" size={20} color="#d17a6b" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  if (isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Filtrar apenas posts do professor logado
  const postsArray = Array.isArray(data) ? data : data?.data || [];
  const userPosts = postsArray.filter((post) => post.authorId === user?.id);

  return (
    <View style={styles.container}>
      {/* Header com menu */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
        </Pressable>
        <Text style={styles.headerTitle}>Gerenciar Posts</Text>
        <Pressable
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.menuButton}
        >
          <MaterialIcons name="menu" size={24} color="#7fb069" />
        </Pressable>
      </View>

      {/* Menu popup */}
      {menuVisible && (
        <View style={styles.menu}>
          <Pressable onPress={handleNavigateHome} style={styles.menuItem}>
            <MaterialIcons name="home" size={20} color="#7fb069" />
            <Text style={styles.menuItemText}>Início</Text>
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable onPress={handleLogout} style={styles.menuItem}>
            <MaterialIcons name="logout" size={20} color="#d17a6b" />
            <Text style={[styles.menuItemText, { color: "#d17a6b" }]}>
              Sair
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={userPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} />
        }
        ListHeaderComponent={
          isFetching ? (
            <View style={styles.searchLoadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.searchLoadingText}>Buscando...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isFetching ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum post encontrado</Text>
            </View>
          ) : null
        }
      />

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
                style={[styles.modalButton, styles.modalDeleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Deletar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e8ddd0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a3f35",
    flex: 1,
    textAlign: "center",
  },
  menuButton: {
    padding: 8,
  },
  menu: {
    position: "absolute",
    top: 70,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8ddd0",
    paddingVertical: 8,
    minWidth: 180,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a3f35",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e8ddd0",
    marginVertical: 8,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1.5,
    borderColor: "#d4c9b8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fefdfb",
  },
  listContent: {
    padding: 12,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e8ddd0",
    shadowColor: "#8b7355",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  postInfo: {
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4a3f35",
    marginBottom: 4,
  },
  postAuthor: {
    fontSize: 11,
    color: "#8b7355",
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 12,
    color: "#6b5f55",
    marginBottom: 4,
  },
  postDate: {
    fontSize: 10,
    color: "#a99678",
  },
  postActions: {
    flexDirection: "row",
    gap: 6,
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#f5faf3",
    borderWidth: 2,
    borderColor: "#7fb069",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f5faf3",
    borderWidth: 2,
    borderColor: "#7fb069",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#fef5f3",
    borderWidth: 2,
    borderColor: "#d17a6b",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#4a3f35",
    fontSize: 11,
    fontWeight: "600",
  },
  deleteText: {
    color: "#4a3f35",
    fontSize: 11,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#8b7355",
    marginTop: 12,
  },
  searchLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#fefdfb",
    borderBottomWidth: 1,
    borderBottomColor: "#e8ddd0",
  },
  searchLoadingText: {
    fontSize: 13,
    color: "#8b7355",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#a99678",
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
  modalDeleteButton: {
    borderColor: "#d17a6b",
    backgroundColor: "#fef5f3",
  },
  deleteButtonText: {
    color: "#d17a6b",
    fontWeight: "600",
    fontSize: 14,
  },
});

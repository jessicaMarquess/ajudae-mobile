import { useAuth } from "@/src/contexts/AuthContext";
import { useDeleteTeacher, useGetTeachers } from "@/src/hooks/useQueries";
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
  TouchableOpacity,
  View,
} from "react-native";

export default function TeachersListScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const { data, isLoading, refetch, isFetching } = useGetTeachers(
    currentPage,
    10
  );
  const deleteTeacherMutation = useDeleteTeacher();

  const isTeacher = user?.role === "professor";

  const handleEdit = (id: string) => {
    router.push(`/(admin)/teachers/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setSelectedDeleteId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await deleteTeacherMutation.mutateAsync(selectedDeleteId);
      setDeleteModalVisible(false);
      setSelectedDeleteId(null);
    } catch (error: any) {
      console.log("Erro ao deletar:", error);
    }
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

  const handleCreateTeacher = () => {
    router.push("/(admin)/teachers/create");
  };

  const renderTeacherItem = ({ item }: any) => (
    <View style={styles.teacherCard}>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{item.name}</Text>
        <Text style={styles.teacherEmail}>{item.email}</Text>
        {item.subject && (
          <Text style={styles.teacherSubject}>Matéria: {item.subject}</Text>
        )}
        {item.department && (
          <Text style={styles.teacherDept}>Depto: {item.department}</Text>
        )}
      </View>
      <View style={styles.teacherActions}>
        {isTeacher && (
          <>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteText}>Deletar</Text>
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

  return (
    <View style={styles.container}>
      {/* Header com menu */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
        </Pressable>
        <Text style={styles.headerTitle}>Gerenciar Professores</Text>
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

      <FlatList
        data={data?.data || []}
        renderItem={renderTeacherItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refetch()} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum professor encontrado</Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateTeacher}
        disabled={!isTeacher}
      >
        <Text style={styles.createButtonText}>+ Novo Professor</Text>
      </TouchableOpacity>

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
              Tem certeza que deseja deletar este professor?
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
    backgroundColor: "#f5f5f5",
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

  listContent: {
    padding: 12,
  },
  teacherCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#e8ddd0",
    shadowColor: "#8b7355",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  teacherInfo: {
    flex: 1,
    marginRight: 12,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4a3f35",
    marginBottom: 4,
  },
  teacherEmail: {
    fontSize: 12,
    color: "#8b7355",
    marginBottom: 6,
  },
  teacherSubject: {
    fontSize: 12,
    color: "#7fb069",
  },
  teacherDept: {
    fontSize: 12,
    color: "#8b7355",
  },
  teacherActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    borderWidth: 2,
    borderColor: "#7fb069",
    backgroundColor: "#f5faf3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: "#d17a6b",
    backgroundColor: "#fef5f3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    color: "#4a3f35",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteText: {
    color: "#4a3f35",
    fontSize: 12,
    fontWeight: "600",
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

  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderWidth: 2,
    borderColor: "#7fb069",
    backgroundColor: "#f5faf3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#8b7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: "#4a3f35",
    fontSize: 14,
    fontWeight: "600",
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

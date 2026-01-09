import { useAuth } from "@/src/contexts/AuthContext";
import { useGetPosts } from "@/src/hooks/useQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  // Define the expected post and response types
  type Post = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: { name: string } | string;
  };

  type PostsResponse = Post[] | { data: Post[] };

  const { data, isLoading, isFetching, error, refetch } = useGetPosts(
    currentPage,
    10,
    searchText || undefined
  ) as {
    data: PostsResponse;
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
    refetch: () => void;
  };

  const isTeacher = user?.role === "professor";

  // Debounce: só atualiza searchText após 300ms de inatividade
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(searchInput);
      setCurrentPage(1); // Resetar para página 1 ao buscar
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleCreatePost = () => {
    router.push("/post/create");
  };

  const handleNavigateToPanel = () => {
    setMenuVisible(false);
    router.push("/(tabs)/explore");
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
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => handlePostPress(item.id)}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postAuthor}>
        Por: {typeof item.author === "string" ? item.author : item.author?.name}
      </Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.postDate}>
        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const ListHeaderComponent = () =>
    isFetching && data ? (
      <View style={styles.loadingHeader}>
        <ActivityIndicator size="small" color="#7fb069" />
        <Text style={styles.loadingText}>Buscando...</Text>
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      {/* Header com menu */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bem-vindo(a),</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
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
          <Pressable
            onPress={() => {
              setMenuVisible(false);
            }}
            style={styles.menuItem}
          >
            <MaterialIcons name="home" size={20} color="#7fb069" />
            <Text style={styles.menuItemText}>Início</Text>
          </Pressable>

          {isTeacher && (
            <Pressable onPress={handleNavigateToPanel} style={styles.menuItem}>
              <MaterialIcons
                name="admin-panel-settings"
                size={20}
                color="#7fb069"
              />
              <Text style={styles.menuItemText}>Painel</Text>
            </Pressable>
          )}

          <View style={styles.menuDivider} />

          <Pressable onPress={handleLogout} style={styles.menuItem}>
            <MaterialIcons name="logout" size={20} color="#d17a6b" />
            <Text style={[styles.menuItemText, { color: "#d17a6b" }]}>
              Sair
            </Text>
          </Pressable>
        </View>
      )}

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts..."
          value={searchInput}
          onChangeText={setSearchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* Lista de posts */}
      <FlatList
        data={Array.isArray(data) ? data : data?.data || []}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !data}
            onRefresh={() => refetch()}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
          </View>
        }
      />

      {/* Botão de criar post - apenas para professores */}
      {isTeacher && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePost}
        >
          <Text style={styles.createButtonText}>+ Criar Post</Text>
        </TouchableOpacity>
      )}
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
  greeting: {
    fontSize: 12,
    color: "#8b7355",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4a3f35",
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
  loadingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#fefdfb",
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e8ddd0",
  },
  loadingText: {
    fontSize: 14,
    color: "#7fb069",
    fontWeight: "600",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e8ddd0",
    shadowColor: "#8b7355",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4a3f35",
    marginBottom: 6,
  },
  postAuthor: {
    fontSize: 12,
    color: "#8b7355",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 13,
    color: "#6b5f55",
    marginBottom: 8,
    lineHeight: 18,
  },
  postDate: {
    fontSize: 11,
    color: "#a99678",
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
});

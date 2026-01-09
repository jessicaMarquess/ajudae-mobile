import { useGetPost, useUpdatePost } from "@/src/hooks/useQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: post, isLoading } = useGetPost(id as string);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const updatePostMutation = useUpdatePost(id as string);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Erro", "Por favor preencha todos os campos");
      return;
    }

    try {
      await updatePostMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      });
      Alert.alert("Sucesso", "Post atualizado com sucesso!");
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Erro ao atualizar post"
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header com título do post */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Editar Post
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o título do post"
                value={title}
                onChangeText={setTitle}
                editable={!updatePostMutation.isPending}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Conteúdo completo</Text>
              <TextInput
                style={[styles.input, styles.largeTextArea]}
                placeholder="Digite o conteúdo completo do post"
                value={content}
                onChangeText={setContent}
                editable={!updatePostMutation.isPending}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                updatePostMutation.isPending && styles.buttonDisabled,
              ]}
              onPress={handleUpdate}
              disabled={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? (
                <ActivityIndicator color="#7fb069" />
              ) : (
                <Text style={styles.buttonText}>Atualizar Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a3f35",
    flex: 1,
    textAlign: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8ddd0",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a3f35",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#d4c9b8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#4a3f35",
    backgroundColor: "#fefdfb",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  largeTextArea: {
    minHeight: 180,
    paddingTop: 12,
  },
  button: {
    backgroundColor: "#f5faf3",
    borderWidth: 2,
    borderColor: "#7fb069",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#4a3f35",
    fontSize: 16,
    fontWeight: "600",
  },
});

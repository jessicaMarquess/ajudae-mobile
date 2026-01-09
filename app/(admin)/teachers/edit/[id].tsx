import { useGetTeacher, useUpdateTeacher } from "@/src/hooks/useQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function EditTeacherScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: teacher, isLoading } = useGetTeacher(id as string);
  const [name, setName] = useState("");
  const updateTeacherMutation = useUpdateTeacher(id as string);

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
    }
  }, [teacher]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Por favor preencha o nome");
      return;
    }

    try {
      await updateTeacherMutation.mutateAsync({
        name: name.trim(),
      });
      Alert.alert("Sucesso", "Professor atualizado com sucesso!");
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Erro ao atualizar professor"
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
        </Pressable>
        <Text style={styles.headerTitle}>Editar Professor</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email (não editável)</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={teacher?.email || ""}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do professor"
              value={name}
              onChangeText={setName}
              editable={!updateTeacherMutation.isPending}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              updateTeacherMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleUpdate}
            disabled={updateTeacherMutation.isPending}
          >
            {updateTeacherMutation.isPending ? (
              <ActivityIndicator color="#7fb069" />
            ) : (
              <Text style={styles.buttonText}>Atualizar Professor</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
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

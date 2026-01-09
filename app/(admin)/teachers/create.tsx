import { useCreateTeacher } from "@/src/hooks/useQueries";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function CreateTeacherScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const createTeacherMutation = useCreateTeacher();

  const handleCreate = async () => {
    if (!email.trim() || !name.trim() || !password.trim()) {
      Alert.alert(
        "Erro",
        "Por favor preencha os campos obrigatórios (email, nome, senha)"
      );
      return;
    }

    try {
      await createTeacherMutation.mutateAsync({
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
        subject: subject.trim() || undefined,
        department: department.trim() || undefined,
      });

      Alert.alert("Sucesso", "Professor criado com sucesso!");
      setTimeout(() => {
        router.replace("/(tabs)/explore");
      }, 500);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Erro ao criar professor"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
        </Pressable>
        <Text style={styles.headerTitle}>Criar Professor</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              editable={!createTeacherMutation.isPending}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do professor"
              value={name}
              onChangeText={setName}
              editable={!createTeacherMutation.isPending}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha segura"
              value={password}
              onChangeText={setPassword}
              editable={!createTeacherMutation.isPending}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              createTeacherMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleCreate}
            disabled={createTeacherMutation.isPending}
          >
            {createTeacherMutation.isPending ? (
              <ActivityIndicator color="#7fb069" />
            ) : (
              <Text style={styles.buttonText}>Criar Professor</Text>
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

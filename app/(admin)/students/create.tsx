import { useCreateStudent } from "@/src/hooks/useQueries";
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

export default function CreateStudentScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState("");
  const [course, setCourse] = useState("");
  const createStudentMutation = useCreateStudent();

  const handleCreate = async () => {
    if (!email.trim() || !name.trim() || !password.trim()) {
      Alert.alert(
        "Erro",
        "Por favor preencha os campos obrigatórios (email, nome, senha)"
      );
      return;
    }

    try {
      await createStudentMutation.mutateAsync({
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
        registration: registration.trim() || undefined,
        course: course.trim() || undefined,
      });
      Alert.alert("Sucesso", "Estudante criado com sucesso!");
      setTimeout(() => {
        router.replace("/(tabs)/explore");
      }, 500);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Erro ao criar estudante"
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
        <Text style={styles.headerTitle}>Criar Estudante</Text>
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
              editable={!createStudentMutation.isPending}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do estudante"
              value={name}
              onChangeText={setName}
              editable={!createStudentMutation.isPending}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha segura"
              value={password}
              onChangeText={setPassword}
              editable={!createStudentMutation.isPending}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              createStudentMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleCreate}
            disabled={createStudentMutation.isPending}
          >
            {createStudentMutation.isPending ? (
              <ActivityIndicator color="#7fb069" />
            ) : (
              <Text style={styles.buttonText}>Criar Estudante</Text>
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

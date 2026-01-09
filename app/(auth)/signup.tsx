import { api } from "@/src/services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não conferem");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso! Faça login para continuar"
      );
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert(
        "Erro ao criar conta",
        error?.response?.data?.message || "Erro desconhecido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
          </Pressable>
          <Text style={styles.headerTitle}>Criar Conta</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
            placeholderTextColor="#a99678"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#a99678"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            secureTextEntry
            placeholderTextColor="#a99678"
          />

          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Repita sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isLoading}
            secureTextEntry
            placeholderTextColor="#a99678"
          />

          <Text style={styles.label}>Tipo de Usuário</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "student" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("student")}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === "student" && styles.roleButtonTextActive,
                ]}
              >
                Aluno
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "teacher" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("teacher")}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === "teacher" && styles.roleButtonTextActive,
                ]}
              >
                Professor
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#4a3f35" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Já tem uma conta? </Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.loginLinkButtonText}>Faça login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },
  content: {
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8ddd0",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a3f35",
    marginBottom: 8,
    marginTop: 12,
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
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#d4c9b8",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#fefdfb",
  },
  roleButtonActive: {
    backgroundColor: "#f5faf3",
    borderColor: "#7fb069",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7fb069",
  },
  roleButtonTextActive: {
    color: "#4a3f35",
  },
  button: {
    backgroundColor: "#f5faf3",
    borderWidth: 2,
    borderColor: "#7fb069",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#4a3f35",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: "#8b7355",
  },
  loginLinkButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7fb069",
  },
});

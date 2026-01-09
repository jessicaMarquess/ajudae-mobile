import { useAuth } from "@/src/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminMenuScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const isTeacher = user?.role === "professor";

  if (!isTeacher) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.headerTitle}>Acesso Restrito</Text>
        <Text style={styles.subtitle}>
          Você não tem permissão para acessar esta área
        </Text>
        <View style={styles.restrictedBox}>
          <Text style={styles.restrictedText}>
            Apenas professores podem acessar o painel de moderação.
          </Text>
        </View>
      </ScrollView>
    );
  }

  const adminSections = [
    {
      title: "Gerenciar Posts",
      description: "Visualizar, editar e deletar todos os posts",
      action: () => router.push("/(admin)/posts"),
      color: "#7fb069",
    },
    {
      title: "Gerenciar Professores",
      description: "Criar, editar e deletar professores",
      action: () => router.push("/(admin)/teachers"),
      color: "#7fb069",
    },
    {
      title: "Gerenciar Estudantes",
      description: "Criar, editar e deletar estudantes",
      action: () => router.push("/(admin)/students"),
      color: "#7fb069",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7fb069" />
        </Pressable>
        <Text style={styles.headerTitle}>Moderação</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Gerencie as postagens da plataforma</Text>

        <View style={styles.sectionContainer}>
          {adminSections.map((section, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={section.action}
            >
              <View
                style={[styles.colorBar, { backgroundColor: section.color }]}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardDescription}>
                  {section.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Informações da Conta</Text>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{user?.name}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>
              {user?.role === "professor" ? "Professor" : "Estudante"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7f5",
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
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#8b7355",
    marginBottom: 24,
  },
  restrictedBox: {
    backgroundColor: "#fef5f3",
    borderWidth: 2,
    borderColor: "#d17a6b",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  restrictedText: {
    fontSize: 16,
    color: "#4a3f35",
    textAlign: "center",
    fontWeight: "500",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.6,
  },
  colorBar: {
    height: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  disabledText: {
    color: "#999",
  },
  disabledMessage: {
    fontSize: 11,
    color: "#ff3b30",
    marginTop: 8,
    fontWeight: "500",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  infoPair: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
});

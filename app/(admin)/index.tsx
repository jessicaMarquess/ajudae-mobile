import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import React from "react";
import {
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

  const adminSections = [
    {
      title: "Gerenciar Posts",
      description: "Visualizar, editar e deletar todos os posts",
      action: () => router.push("/(admin)/posts"),
      color: "#007AFF",
    },
    {
      title: "Gerenciar Professores",
      description: "Criar, editar e deletar professores",
      action: () => router.push("/(admin)/teachers"),
      color: "#34C759",
      disabled: !isTeacher,
    },
    {
      title: "Gerenciar Estudantes",
      description: "Criar, editar e deletar estudantes",
      action: () => router.push("/(admin)/students"),
      color: "#FF9500",
      disabled: !isTeacher,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>
        {isTeacher
          ? "Você tem acesso às funções administrativas"
          : "Você tem permissão limitada"}
      </Text>

      <View style={styles.sectionContainer}>
        {adminSections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, section.disabled && styles.disabledCard]}
            onPress={section.action}
            disabled={section.disabled}
          >
            <View
              style={[
                styles.colorBar,
                { backgroundColor: section.color },
                section.disabled && { opacity: 0.5 },
              ]}
            />
            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.cardTitle,
                  section.disabled && styles.disabledText,
                ]}
              >
                {section.title}
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  section.disabled && styles.disabledText,
                ]}
              >
                {section.description}
              </Text>
              {section.disabled && (
                <Text style={styles.disabledMessage}>
                  Apenas professores podem acessar
                </Text>
              )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
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
    fontSize: 12,
    color: "#ff9500",
    marginTop: 8,
    fontWeight: "500",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoPair: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
});

import { useAuth } from "@/src/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Componente do Drawer Content customizado
function CustomDrawerContent(props: any) {
  const { user, logout } = useAuth();
  const isTeacher = user?.role === "professor";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>
              {isTeacher ? "Professor" : "Estudante"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.drawerMenu}>
        <DrawerItem
          label="Início"
          icon="home"
          onPress={() => props.navigation.navigate("index")}
        />

        {isTeacher && (
          <DrawerItem
            label="Painel"
            icon="admin-panel-settings"
            onPress={() => props.navigation.navigate("(admin)/posts")}
          />
        )}

        <View style={styles.divider} />

        <DrawerItem
          label="Sair"
          icon="logout"
          onPress={handleLogout}
          textColor="#d17a6b"
          iconColor="#d17a6b"
        />
      </View>
    </View>
  );
}

interface DrawerItemProps {
  label: string;
  icon: string;
  onPress: () => void;
  textColor?: string;
  iconColor?: string;
}

function DrawerItem({
  label,
  icon,
  onPress,
  textColor = "#4a3f35",
  iconColor = "#7fb069",
}: DrawerItemProps) {
  return (
    <View style={styles.drawerItem}>
      <MaterialIcons name={icon as any} size={24} color={iconColor} />
      <Text style={[styles.drawerItemText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#f8f7f5",
  },
  drawerHeader: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e8ddd0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7fb069",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a3f35",
  },
  userRole: {
    fontSize: 12,
    color: "#8b7355",
  },
  drawerMenu: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e8ddd0",
    marginVertical: 16,
  },
});

export { CustomDrawerContent };

import { Stack } from "expo-router";
import React from "react";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="teachers/index"
        options={{
          title: "Gerenciar Professores",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="teachers/create"
        options={{
          title: "Criar Professor",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="teachers/edit/[id]"
        options={{
          title: "Editar Professor",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="students/index"
        options={{
          title: "Gerenciar Estudantes",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="students/create"
        options={{
          title: "Criar Estudante",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="students/edit/[id]"
        options={{
          title: "Editar Estudante",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="posts/index"
        options={{
          title: "Gerenciar Posts",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

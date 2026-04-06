import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CategoryFilter from "@/src/components/CategoryFilter";
import TaskCard from "@/src/components/TaskCard";

const categories = [
  "Todos",
  "Trabalhos",
  "Pessoal",
  "Dia a dia",
  "Teste",
  "Outro",
];
const tasks = [
  { id: "1", title: "Revisar relatório mensal", category: "Trabalhos" },
  { id: "2", title: "Reunião com equipe", category: "Trabalhos" },
  { id: "3", title: "Comprar remédio", category: "Pessoal" },
  { id: "4", title: "Lavar a louça", category: "Dia a dia" },
];

//const tasks: any[] = [];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredTasks = useMemo(() => {
    if (selectedCategory === "Todos") return tasks;

    return tasks.filter((task) => task.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Categorias */}
      <View style={styles.categoriesContainer}>
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../assets/images/task-empty.png")} // 👈 IMPORTANTE: PNG
              style={styles.emptyImage}
              resizeMode="contain"
            />

            <Text style={styles.emptyText}>
              Nenhuma tarefa em {selectedCategory}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <TaskCard title={item.title} />}
          />
        )}
      </View>

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItem} activeOpacity={0.8}>
          <MaterialIcons name="add" size={24} color="#5EA5E8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem} activeOpacity={0.8}>
          <View style={styles.activeCircle}>
            <MaterialIcons name="list" size={22} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem} activeOpacity={0.8}>
          <MaterialIcons name="calendar-today" size={22} color="#5EA5E8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomItem} activeOpacity={0.8}>
          <MaterialIcons name="person-outline" size={24} color="#5EA5E8" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  categoriesContainer: {
    marginTop: 12,
    marginBottom: 8,
  },

  content: {
    flex: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
    paddingHorizontal: 20,
  },

  emptyImage: {
    width: 170,
    height: 170,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  listContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 100,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  taskTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 70,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#5EA5E8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  bottomBar: {
    height: 56,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  bottomItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },

  activeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#5EA5E8",
    justifyContent: "center",
    alignItems: "center",
  },
});

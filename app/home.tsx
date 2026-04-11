import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import CategoryFilter from "@/src/components/CategoryFilter";
import TaskCard from "@/src/components/TaskCard";

// IMPORTANTE: Importe o novo componente aqui
import CreateTaskModal from "@/src/components/CreateTaskModal";

const categories = ["Todos", "Trabalhos", "Pessoal", "Dia a dia", "Teste", "Outro"];
const tasks: { id: string; title: string; category: string }[] = [];

export default function Home() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // ESTADO PARA ABRIR O MODAL
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTasks = useMemo(() => {
    if (selectedCategory === "Todos") return tasks;
    return tasks.filter((task) => task.category === selectedCategory);
  }, [selectedCategory]);

  const bottomBarHeight = 60 + insets.bottom;
  const fabBottom = bottomBarHeight + 16;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.categoriesWrapper}>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        <View style={styles.content}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require("../assets/images/task-empty.png")}
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
              renderItem={({ item }) => <TaskCard title={item.title} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: bottomBarHeight + 90 },
              ]}
            />
          )}
        </View>

        {/* FAB: Agora altera o estado para true */}
        <TouchableOpacity
          style={[styles.fab, { bottom: fabBottom }]}
          activeOpacity={0.85}
          onPress={() => setShowCreateModal(true)}
        >
          <MaterialIcons name="add" size={30} color="#fff" />
        </TouchableOpacity>

        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: insets.bottom,
              minHeight: bottomBarHeight,
            },
          ]}
        >
          {/* Botão + da Navbar inferior também abre o modal */}
          <TouchableOpacity style={styles.bottomItem} activeOpacity={0.8} onPress={() => setShowCreateModal(true)}>
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
      </View>

      {/* INSERINDO O COMPONENTE DO MODAL AQUI */}
      <CreateTaskModal 
        visible={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
    </SafeAreaView>
  );
}

// ... SEUS ESTILOS ORIGINAIS DA HOME CONTINUAM AQUI INTACTOS
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  categoriesWrapper: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  fab: {
    position: "absolute",
    right: 18,
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
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
  },
  bottomItem: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5EA5E8",
    alignItems: "center",
    justifyContent: "center",
  },
});
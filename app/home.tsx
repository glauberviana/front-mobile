import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
import CreateTaskModal from "@/src/components/CreateTaskModal";
import TaskCard from "@/src/components/TaskCard";
import { useTasks } from "@/src/contexts/TasksContext";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const { tasks, categories, fetchTasks, handleSaveTask, handleDeleteTask, handleToggleComplete } = useTasks();

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Busca as tasks sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const onSaveTask = async (taskData: any) => {
    await handleSaveTask(taskData, modalMode, selectedTask?.id);
    setShowCreateModal(false);
  };

  const filteredTasks = useMemo(() => {
    if (selectedCategory === "Todos") return tasks;

    return tasks.filter((task) => task.category === selectedCategory);
  }, [selectedCategory, tasks]);

  const bottomBarHeight = 60 + insets.bottom;
  const fabBottom = bottomBarHeight + 16;

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
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
                Nenhuma tarefa em{" "}
                {selectedCategory}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTask(item);
                    setModalMode("edit");
                    setShowCreateModal(true);
                  }}
                >
                  <TaskCard task={item} onToggle={handleToggleComplete} />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.listContent,
                {
                  paddingBottom:
                    bottomBarHeight + 90,
                },
              ]}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.fab, { bottom: fabBottom }]}
          activeOpacity={0.85}
          onPress={() => {
            setModalMode("create");
            setSelectedTask(null);
            setShowCreateModal(true);
          }}
        >
          <MaterialIcons
            name="add"
            size={30}
            color="#fff"
          />
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
          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.8}
            onPress={() => router.push("/home")}
          >
            {pathname === "/home" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons
                  name="list"
                  size={22}
                  color="#fff"
                />
              </View>
            ) : (
              <MaterialIcons
                name="list"
                size={22}
                color="#5EA5E8"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.8}
            onPress={() => router.push("./calendar")}
          >
            {pathname === "/calendar" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons
                  name="calendar-today"
                  size={22}
                  color="#fff"
                />
              </View>
            ) : (
              <MaterialIcons
                name="calendar-today"
                size={22}
                color="#5EA5E8"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.8}
            onPress={() => router.push("./dashboard")}
          >
            {pathname === "/dashboard" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons
                  name="person-outline"
                  size={24}
                  color="#fff"
                />
              </View>
            ) : (
              <MaterialIcons
                name="person-outline"
                size={24}
                color="#5EA5E8"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <CreateTaskModal
        visible={showCreateModal}
        mode={modalMode}
        initialData={selectedTask}
        categories={categories.filter((item) => item !== "Todos")}
        onAddCategory={useTasks().addCategory}
        onClose={() => setShowCreateModal(false)}
        onSaveTask={onSaveTask}
        onDeleteTask={async () => {
          if (selectedTask) {
            await handleDeleteTask(selectedTask.id);
            setShowCreateModal(false);
          }
        }}
      />
    </SafeAreaView>
  );
}

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
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  bottomBar: {
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-evenly",
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

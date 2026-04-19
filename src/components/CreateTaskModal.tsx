import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (category: { name: string }) => void;
}

function CreateCategoryModal({
  visible,
  onClose,
  onCreate,
}: CreateCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");

  const handleCreateCategory = () => {
    if (!categoryName.trim()) return;
    onCreate({ name: categoryName.trim() });
    setCategoryName("");
    onClose();
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlayCenter}>
        <View style={styles.centerCard}>
          <Text style={styles.modalTitle}>Criar categoria</Text>

          <TextInput
            placeholder="Nome da categoria"
            placeholderTextColor="#9ca3af"
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.input}
            autoFocus
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !categoryName.trim() && { opacity: 0.5 },
              ]}
              onPress={handleCreateCategory}
              disabled={!categoryName.trim()}
            >
              <Text style={styles.confirmBtnText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function CreateTaskModal({
  visible,
  onClose,
}: CreateTaskModalProps) {
  const insets = useSafeAreaInsets();

  const [taskTitle, setTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Sem categoria");

  const handleCloseAll = () => {
    setTaskTitle("");
    setIsLoading(false);
    setShowDateModal(false);
    setShowRepeatModal(false);
    setIsCategoryModalVisible(false);
    setSelectedCategory("Sem categoria");
    onClose();
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || isLoading) return;

    setIsLoading(true);

    setTimeout(() => {
      console.log("Tarefa salva com sucesso:", {
        title: taskTitle,
        category: selectedCategory,
      });
      handleCloseAll();
    }, 2000);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseAll}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <TouchableOpacity activeOpacity={1} style={styles.card}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Insira uma nova tarefa aqui"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  autoFocus
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                  <TouchableOpacity
                    style={styles.badge}
                    disabled={isLoading}
                    onPress={() => setIsCategoryModalVisible(true)}
                  >
                    <Text style={styles.badgeText}>{selectedCategory}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowDateModal(true)}
                    disabled={isLoading}
                  >
                    <MaterialIcons
                      name="calendar-today"
                      size={22}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowRepeatModal(true)}
                    disabled={isLoading}
                  >
                    <MaterialIcons name="repeat" size={22} color="#9ca3af" />
                  </TouchableOpacity>

                  <TouchableOpacity disabled={isLoading}>
                    <MaterialIcons name="sort" size={22} color="#9ca3af" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.badge} disabled={isLoading}>
                    <Text style={styles.badgeText}>Prioridade</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!taskTitle.trim() || isLoading) && { opacity: 0.5 },
                  ]}
                  onPress={handleSaveTask}
                  disabled={!taskTitle.trim() || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialIcons
                      name="send"
                      size={20}
                      color="#fff"
                      style={{ marginLeft: 2 }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showDateModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.centerCard}>
            <View style={styles.calendarHeader}>
              <MaterialIcons name="chevron-left" size={24} color="#374151" />
              <Text style={styles.modalTitle}>Março 2026</Text>
              <MaterialIcons name="chevron-right" size={24} color="#374151" />
            </View>

            <View style={styles.calendarGrid}>
              <Text style={styles.placeholderGrid}>
                [ Grade do Calendário ]
              </Text>
            </View>

            <View style={styles.quickDateRow}>
              {["Sem data", "Hoje", "Amanhã"].map((d) => (
                <TouchableOpacity key={d} style={styles.quickDateBtn}>
                  <Text style={styles.quickDateText}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  setShowDateModal(false);
                  setShowRepeatModal(true);
                }}
              >
                <Text style={styles.confirmBtnText}>Concluído</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showRepeatModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.centerCard, { alignItems: "center" }]}>
            <Text style={[styles.modalTitle, { marginBottom: 25 }]}>
              Repetir tarefa
            </Text>

            <View style={styles.repeatOptions}>
              {["Diário", "Semanal", "Mensal"].map((opt, index) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optBtn, index === 1 && styles.optBtnActive]}
                >
                  <Text
                    style={index === 1 ? styles.optTextActive : styles.optText}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBlueBtn}
                onPress={() => setShowRepeatModal(false)}
              >
                <Text style={styles.confirmBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => setShowRepeatModal(false)}
              >
                <Text style={styles.cancelText}>Concluído</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CreateCategoryModal
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onCreate={(newCategory) => {
          setSelectedCategory(newCategory.name);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "flex-end",
    padding: 16,
  },
  keyboardAvoid: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 80,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#374151",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5EA5E8",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  centerCard: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  calendarGrid: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 20,
  },
  placeholderGrid: {
    color: "#9ca3af",
  },
  quickDateRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  quickDateBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  quickDateText: {
    fontSize: 13,
    color: "#4b5563",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 15,
    width: "100%",
    marginTop: 20,
  },
  cancelText: {
    color: "#5EA5E8",
    fontWeight: "bold",
  },
  confirmBtn: {
    backgroundColor: "#5EA5E8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  repeatOptions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },
  optBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  optBtnActive: {
    backgroundColor: "#5EA5E8",
  },
  optText: {
    color: "#4b5563",
  },
  optTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelBlueBtn: {
    backgroundColor: "#5EA5E8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#5EA5E8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

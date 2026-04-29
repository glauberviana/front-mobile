import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { Calendar, LocaleConfig } from "react-native-calendars";

// Tradução do Calendário
LocaleConfig.locales["pt-br"] = {
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  dayNamesShort: ["D", "S", "T", "Q", "Q", "S", "S"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

const { width } = Dimensions.get("window");

const PRIORITIES = ["Normal", "Alta", "Urgente", "Baixa"];
const REMINDERS = ["Não", "10 min antes", "1 hora antes", "1 dia antes"];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgente": return "#ef4444";
    case "Alta": return "#f59e0b";
    case "Baixa": return "#10b981";
    default: return "#9ca3af";
  }
};

// --- MODAL AUXILIAR DE CATEGORIA ---
function CreateCategoryModal({ visible, onClose, onCreate }: any) {
  const [categoryName, setCategoryName] = useState("");

  const handleCreateCategory = () => {
    if (!categoryName.trim()) return;
    onCreate({ name: categoryName.trim() });
    setCategoryName("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlayCenter}>
        <View style={styles.centerCard}>
          <Text style={styles.modalTitle}>Criar categoria</Text>
          <TextInput
            placeholder="Nome da categoria..."
            placeholderTextColor="#9ca3af"
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.input}
            autoFocus
          />
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onClose} style={styles.cancelActionBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, !categoryName.trim() && { opacity: 0.5 }]}
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

// --- COMPONENTE PRINCIPAL ---
export default function CreateTaskModal({ visible, onClose, onSaveTask, onDeleteTask, mode = "create", initialData }: any) {
  
  // Base de datas
  const todayDate = useMemo(() => new Date(), []);
  
  const tomorrowDate = useMemo(() => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() + 1);
    return d;
  }, [todayDate]);
  const tomorrowStr = useMemo(() => tomorrowDate.toISOString().split("T")[0], [tomorrowDate]);

  // Novas variáveis para saber qual é o dia exato de "3 dias" e "Este domingo"
  const threeDaysDate = useMemo(() => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() + 3);
    return d;
  }, [todayDate]);
  const threeDaysStr = useMemo(() => threeDaysDate.toISOString().split("T")[0], [threeDaysDate]);

  const sundayDate = useMemo(() => {
    const d = new Date(todayDate);
    const diff = d.getDay() === 0 ? 0 : 7 - d.getDay();
    d.setDate(d.getDate() + diff);
    return d;
  }, [todayDate]);
  const sundayStr = useMemo(() => sundayDate.toISOString().split("T")[0], [sundayDate]);


  const [taskTitle, setTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Sem categoria");
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [reminderIndex, setReminderIndex] = useState(0);
  const [repeatOption, setRepeatOption] = useState("Não");

  const [showDateModal, setShowDateModal] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const [selectedDateStr, setSelectedDateStr] = useState<string>(tomorrowStr);

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        setTaskTitle(initialData.title);
        setSelectedCategory(initialData.category || "Sem categoria");
        setPriorityIndex(Math.max(0, PRIORITIES.indexOf(initialData.priority)));
        setSelectedDateStr(initialData.dateStr || tomorrowStr);
      } else {
        setTaskTitle("");
        setSelectedCategory("Sem categoria");
        setPriorityIndex(0);
        setRepeatOption("Não");
        setReminderIndex(0);
        setSelectedDateStr(tomorrowStr);
      }
    }
  }, [visible, mode, initialData, tomorrowStr]);

  const handleCloseAll = () => {
    setIsLoading(false);
    setShowDateModal(false);
    setShowRepeatModal(false);
    setIsCategoryModalVisible(false);
    onClose();
  };

  const handleQuickDate = (type: string) => {
    if (type === "Sem data") {
      setSelectedDateStr("");
      return;
    }
    
    if (type === "Amanhã") setSelectedDateStr(tomorrowStr);
    else if (type === "3 Dias depois") setSelectedDateStr(threeDaysStr);
    else if (type === "Este domingo") setSelectedDateStr(sundayStr);
  };

  const handleSave = () => {
    if (!taskTitle.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      onSaveTask({
        id: mode === "edit" ? initialData?.id : Math.random().toString(),
        title: taskTitle.trim(),
        category: selectedCategory,
        priority: PRIORITIES[priorityIndex],
        dateStr: selectedDateStr,
        repeat: repeatOption,
        reminder: REMINDERS[reminderIndex],
      });
      handleCloseAll();
    }, 1200);
  };

  return (
    <>
      {/* MODAL 1: ENTRADA DE DADOS */}
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={handleCloseAll}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
            <TouchableOpacity activeOpacity={1} style={styles.card}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="O que você precisa fazer?"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  autoFocus
                  maxLength={50}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
                <Text style={styles.charCounter}>{taskTitle.length}/50</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                  <TouchableOpacity style={styles.badge} onPress={() => setIsCategoryModalVisible(true)}>
                    <Text style={styles.badgeText}>{selectedCategory}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconBtn} onPress={() => setShowDateModal(true)}>
                    <MaterialIcons name="calendar-today" size={20} color={selectedDateStr ? "#5EA5E8" : "#9ca3af"} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconBtn} onPress={() => setShowRepeatModal(true)}>
                    <MaterialIcons name="repeat" size={20} color={repeatOption !== "Não" ? "#5EA5E8" : "#9ca3af"} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.badge, { borderColor: getPriorityColor(PRIORITIES[priorityIndex]) }]}
                    onPress={() => setPriorityIndex((priorityIndex + 1) % PRIORITIES.length)}
                  >
                    <Text style={[styles.badgeText, { color: getPriorityColor(PRIORITIES[priorityIndex]), fontWeight: 'bold' }]}>
                      {PRIORITIES[priorityIndex]}
                    </Text>
                  </TouchableOpacity>

                  {mode === "edit" && (
                    <TouchableOpacity
                      style={styles.iconBtn}
                      onPress={() => {
                        Alert.alert("Excluir Tarefa", "Tem certeza que deseja apagar?", [
                          { text: "Cancelar", style: "cancel" },
                          { text: "Excluir", style: "destructive", onPress: () => { onDeleteTask?.(initialData.id); handleCloseAll(); } },
                        ]);
                      }}
                    >
                      <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.sendButton, (!taskTitle.trim() || isLoading) && { opacity: 0.5 }]}
                  onPress={handleSave}
                  disabled={!taskTitle.trim() || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialIcons name={mode === "edit" ? "check" : "send"} size={18} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      {/* MODAL 2: CALENDÁRIO COM A BIBLIOTECA OFICIAL */}
      <Modal visible={showDateModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.centerCard}>
            <Calendar
              minDate={tomorrowStr}
              hideExtraDays={true}
              current={selectedDateStr || tomorrowStr}
              onDayPress={(day: any) => setSelectedDateStr(day.dateString)}
              markedDates={{
                [selectedDateStr]: { selected: true, selectedColor: "#5EA5E8" },
              }}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#9ca3af",
                selectedDayBackgroundColor: "#5EA5E8",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#f59e0b",
                dayTextColor: "#374151",
                textDisabledColor: "#d1d5db",
                arrowColor: "#5EA5E8",
                monthTextColor: "#111827",
                textDayFontWeight: "500",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "bold",
              }}
              renderArrow={(direction: string) => (
                <MaterialIcons name={direction === "left" ? "chevron-left" : "chevron-right"} size={26} color="#5EA5E8" />
              )}
            />

            <View style={styles.quickDateRow}>
              {["Sem data", "Amanhã", "3 Dias depois", "Este domingo"].map((d) => {
                
                // REGRA CORRIGIDA: Agora o código sabe checar cada botão separadamente
                const isActive = 
                  (d === "Sem data" && !selectedDateStr) ||
                  (d === "Amanhã" && selectedDateStr === tomorrowStr) ||
                  (d === "3 Dias depois" && selectedDateStr === threeDaysStr) ||
                  (d === "Este domingo" && selectedDateStr === sundayStr);

                return (
                  <TouchableOpacity key={d} style={[styles.quickDateBtn, isActive && styles.quickDateBtnActive]} onPress={() => handleQuickDate(d)}>
                    <Text style={[styles.quickDateText, isActive && styles.quickDateTextActive]}>{d}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.settingsGroup}>
              <TouchableOpacity style={styles.optionItem} onPress={() => setReminderIndex((reminderIndex + 1) % REMINDERS.length)}>
                <View style={styles.optionLeft}>
                  <MaterialIcons name="notifications-none" size={20} color="#9ca3af" />
                  <Text style={styles.optionLabel}>Lembrete</Text>
                </View>
                <Text style={[styles.optionValue, reminderIndex > 0 && { color: "#5EA5E8", fontWeight: "bold" }]}>{REMINDERS[reminderIndex]}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem} onPress={() => setShowRepeatModal(true)}>
                <View style={styles.optionLeft}>
                  <MaterialIcons name="repeat" size={20} color="#9ca3af" />
                  <Text style={styles.optionLabel}>Repetir</Text>
                </View>
                <Text style={[styles.optionValue, repeatOption !== "Não" && { color: "#5EA5E8", fontWeight: "bold" }]}>{repeatOption}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelActionBtn} onPress={() => setShowDateModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowDateModal(false)}>
                <Text style={styles.confirmBtnText}>Concluído</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: REPETIÇÃO */}
      <Modal visible={showRepeatModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.centerCard, { alignItems: "center" }]}>
            <Text style={[styles.modalTitle, { marginBottom: 24 }]}>Repetir tarefa</Text>
            
            <View style={styles.repeatOptions}>
              {["Diário", "Semanal", "Mensal", "Não"].map((opt) => (
                <TouchableOpacity key={opt} style={[styles.optBtn, repeatOption === opt && styles.optBtnActive]} onPress={() => setRepeatOption(opt)}>
                  <Text style={repeatOption === opt ? styles.optTextActive : styles.optText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={[styles.modalFooter, { width: "100%", justifyContent: "center" }]}>
              <TouchableOpacity style={styles.cancelActionBtn} onPress={() => setShowRepeatModal(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowRepeatModal(false)}>
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CreateCategoryModal
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onCreate={(newCategory: any) => setSelectedCategory(newCategory.name)}
      />
    </>
  );
}

// --- ESTILOS VISUAIS ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
    padding: 16,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  keyboardAvoid: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  centerCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 45,
    fontSize: 16,
    color: "#374151",
    backgroundColor: "#FAFAFA",
  },
  charCounter: {
    position: "absolute",
    right: 16,
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
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
  iconBtn: {
    padding: 6,
  },
  badge: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  badgeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5EA5E8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#5EA5E8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  quickDateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  quickDateBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  quickDateBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#5EA5E8",
  },
  quickDateText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  quickDateTextActive: {
    color: "#5EA5E8",
    fontWeight: "700",
  },
  settingsGroup: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  optionValue: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
  cancelActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 15,
  },
  confirmBtn: {
    backgroundColor: "#5EA5E8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  repeatOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  optBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  optBtnActive: {
    backgroundColor: "#5EA5E8",
  },
  optText: {
    color: "#4B5563",
    fontWeight: "500",
  },
  optTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width * 0.9 - 48) / 7;

const PRIORITIES = ["Normal", "Alta", "Urgente", "Baixa"];
const REMINDERS = ["Não", "10 min antes", "1 hora antes", "1 dia antes"];

<<<<<<< HEAD
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgente": return "#ef4444";
    case "Alta": return "#f59e0b";
    case "Baixa": return "#10b981";
    default: return "#9ca3af";
  }
};

// --- MODAL CATEGORIA ---
function CreateCategoryModal({ visible, onClose, onCreate }: any) {
  const [categoryName, setCategoryName] = useState("");
  const handleCreateCategory = () => {
    if (!categoryName.trim()) return;
    onCreate({ name: categoryName.trim() });
    setCategoryName("");
=======
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
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
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
            <TouchableOpacity onPress={onClose}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleCreateCategory}>
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
  onSaveTask,
  onDeleteTask,
  mode = "create",
  initialData,
}: any) {
  const today = useMemo(() => {
    const d = new Date(2026, 3, 19); // 19 de Abril de 2026
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [taskTitle, setTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Sem categoria");
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [reminderIndex, setReminderIndex] = useState(0);
  const [repeatOption, setRepeatOption] = useState("Não");

  const [showDateModal, setShowDateModal] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const [viewDate, setViewDate] = useState(new Date(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(today));

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && initialData) {
        setTaskTitle(initialData.title);
        setSelectedCategory(initialData.category || "Sem categoria");
        setPriorityIndex(Math.max(0, PRIORITIES.indexOf(initialData.priority)));
      } else {
        setTaskTitle("");
        setSelectedCategory("Sem categoria");
        setPriorityIndex(0);
        setRepeatOption("Não");
        setReminderIndex(0);
        setSelectedDate(new Date(today));
        setViewDate(new Date(today));
      }
    }
  }, [visible, mode, initialData]);

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= days; i++) arr.push(i);
    return arr;
  }, [viewDate]);

  const monthLabel = useMemo(() => {
    const label = viewDate.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [viewDate]);

  const handleQuickDate = (type: string) => {
    let newDate = new Date(today);
    if (type === "Hoje") newDate = new Date(today);
    else if (type === "Amanhã") newDate.setDate(today.getDate() + 1);
    else if (type === "3 Dias depois") newDate.setDate(today.getDate() + 3);
    else if (type === "Este domingo") {
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
      newDate.setDate(today.getDate() + diff);
    } else if (type === "Sem data") { setSelectedDate(null); return; }
    setSelectedDate(newDate);
    setViewDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || isLoading) return;
    setIsLoading(true);
<<<<<<< HEAD
    setTimeout(() => {
      onSaveTask({
        id: mode === "edit" ? initialData?.id : Math.random().toString(),
        title: taskTitle.trim(),
        category: selectedCategory,
        priority: PRIORITIES[priorityIndex],
        date: selectedDate ? selectedDate.toLocaleDateString('pt-BR') : "Sem data",
        repeat: repeatOption,
        reminder: REMINDERS[reminderIndex]
      });
      setIsLoading(false);
      onClose();
    }, 1200);
=======

    setTimeout(() => {
      console.log("Tarefa salva com sucesso:", {
        title: taskTitle,
        category: selectedCategory,
      });
      handleCloseAll();
    }, 2000);
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
<<<<<<< HEAD
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
=======
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseAll}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
            <TouchableOpacity activeOpacity={1} style={styles.card}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Insira uma nova tarefa aqui"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  autoFocus
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />
              </View>
<<<<<<< HEAD
              <View style={styles.divider} />
              <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                  <TouchableOpacity style={styles.badge} onPress={() => setIsCategoryModalVisible(true)}>
                    <Text style={styles.badgeText}>{selectedCategory}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowDateModal(true)}>
                    <MaterialIcons name="calendar-today" size={22} color={selectedDate ? "#5EA5E8" : "#9ca3af"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowRepeatModal(true)}>
                    <MaterialIcons name="repeat" size={22} color={repeatOption !== "Não" ? "#5EA5E8" : "#9ca3af"} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.badge, { borderColor: getPriorityColor(PRIORITIES[priorityIndex]) }]}
                    onPress={() => setPriorityIndex((priorityIndex + 1) % PRIORITIES.length)}
                  >
                    <Text style={[styles.badgeText, { color: getPriorityColor(PRIORITIES[priorityIndex]) }]}>{PRIORITIES[priorityIndex]}</Text>
                  </TouchableOpacity>
                  {mode === "edit" && (
                    <TouchableOpacity onPress={() => onDeleteTask?.(initialData.id)}>
                      <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
                    </TouchableOpacity>
=======

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
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
                  )}
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={handleSaveTask}>
                  {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <MaterialIcons name={mode === "edit" ? "check" : "send"} size={20} color="#fff" />}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

<<<<<<< HEAD
      {/* MODAL DATA COM TUDO O QUE VOCÊ PEDIU NO PRINT */}
=======
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
      <Modal visible={showDateModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.centerCard}>
            <View style={styles.calendarHeader}>
<<<<<<< HEAD
              <TouchableOpacity onPress={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}><MaterialIcons name="chevron-left" size={24} color="#374151" /></TouchableOpacity>
              <Text style={styles.modalTitle}>{monthLabel}</Text>
              <TouchableOpacity onPress={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}><MaterialIcons name="chevron-right" size={24} color="#374151" /></TouchableOpacity>
=======
              <MaterialIcons name="chevron-left" size={24} color="#374151" />
              <Text style={styles.modalTitle}>Março 2026</Text>
              <MaterialIcons name="chevron-right" size={24} color="#374151" />
            </View>

            <View style={styles.calendarGrid}>
              <Text style={styles.placeholderGrid}>
                [ Grade do Calendário ]
              </Text>
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
            </View>

            <View style={styles.calendarGridContainer}>
              {["D", "S", "T", "Q", "Q", "S", "S"].map(d => <Text key={d} style={styles.weekDayText}>{d}</Text>)}
              {daysInMonth.map((day, i) => {
                const checkDate = day ? new Date(viewDate.getFullYear(), viewDate.getMonth(), day) : null;
                const isPast = checkDate ? checkDate < today : false;
                const isSelected = selectedDate && day === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth();
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.dayBox, isSelected && styles.daySelected, isPast && { opacity: 0.2 }]}
                    disabled={!day || isPast}
                    onPress={() => day && setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                  >
                    <Text style={[styles.dayText, isSelected && { color: '#fff', fontWeight: 'bold' }, !day && { color: 'transparent' }]}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* BOTÕES DE ATALHO DO SEU PRINT */}
            <View style={styles.quickDateRow}>
<<<<<<< HEAD
              {["Sem data", "Hoje", "Amanhã", "3 Dias depois", "Este domingo"].map(d => (
                <TouchableOpacity key={d} style={[styles.quickDateBtn, selectedDate?.toLocaleDateString() === d && styles.optBtnActive]} onPress={() => handleQuickDate(d)}>
=======
              {["Sem data", "Hoje", "Amanhã"].map((d) => (
                <TouchableOpacity key={d} style={styles.quickDateBtn}>
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
                  <Text style={styles.quickDateText}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* LEMBRETE E REPETIR (IGUAL AO PRINT) */}
            <TouchableOpacity style={styles.optionItem} onPress={() => setReminderIndex((reminderIndex + 1) % REMINDERS.length)}>
                <View style={styles.optionLeft}><MaterialIcons name="notifications-none" size={20} color="#9ca3af" /><Text style={styles.optionLabel}>Lembrete</Text></View>
                <Text style={[styles.optionValue, reminderIndex > 0 && {color: '#5EA5E8'}]}>{REMINDERS[reminderIndex]}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} onPress={() => setShowRepeatModal(true)}>
                <View style={styles.optionLeft}><MaterialIcons name="repeat" size={20} color="#9ca3af" /><Text style={styles.optionLabel}>Repetir</Text></View>
                <Text style={[styles.optionValue, repeatOption !== "Não" && {color: '#5EA5E8'}]}>{repeatOption}</Text>
            </TouchableOpacity>

            <View style={styles.modalFooter}>
<<<<<<< HEAD
              <TouchableOpacity onPress={() => setShowDateModal(false)}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowDateModal(false)}><Text style={styles.confirmBtnText}>Concluído</Text></TouchableOpacity>
=======
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
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
            </View>
          </View>
        </View>
      </Modal>

<<<<<<< HEAD
      {/* MODAL REPETIÇÃO */}
      <Modal visible={showRepeatModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.centerCard, { alignItems: "center" }]}>
            <Text style={[styles.modalTitle, { marginBottom: 25 }]}>Repetir tarefa</Text>
            <View style={styles.repeatOptions}>
              {["Diário", "Semanal", "Mensal", "Não"].map((opt) => (
                <TouchableOpacity key={opt} style={[styles.optBtn, repeatOption === opt && styles.optBtnActive]} onPress={() => setRepeatOption(opt)}>
                  <Text style={repeatOption === opt ? styles.optTextActive : styles.optText}>{opt}</Text>
=======
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
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalFooter}>
<<<<<<< HEAD
              <TouchableOpacity style={styles.cancelBlueBtn} onPress={() => setShowRepeatModal(false)}><Text style={styles.confirmBtnText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.outlineBtn} onPress={() => setShowRepeatModal(false)}><Text style={styles.cancelText}>Concluído</Text></TouchableOpacity>
=======
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
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
            </View>
          </View>
        </View>
      </Modal>

<<<<<<< HEAD
      <CreateCategoryModal visible={isCategoryModalVisible} onClose={() => setIsCategoryModalVisible(false)} onCreate={(newCat: any) => setSelectedCategory(newCat.name)} />
=======
      <CreateCategoryModal
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onCreate={(newCategory) => {
          setSelectedCategory(newCategory.name);
        }}
      />
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6
    </>
  );
}

// --- ESTRUTURA DO SEU PRINT MANTIDA ---
const styles = StyleSheet.create({
<<<<<<< HEAD
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)", justifyContent: "flex-end", padding: 16 },
  keyboardAvoid: { width: "100%" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 80, elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  inputContainer: { marginBottom: 12 },
  input: { height: 48, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, paddingHorizontal: 14, fontSize: 16, color: "#374151" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginBottom: 12 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leftActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { fontSize: 12, color: "#9ca3af", fontWeight: "500" },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#5EA5E8", justifyContent: "center", alignItems: "center" },
  modalOverlayCenter: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  centerCard: { width: width * 0.9, backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  calendarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 16 },
  calendarGridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: 10 },
  weekDayText: { width: COLUMN_WIDTH, textAlign: 'center', fontSize: 12, color: '#9ca3af', marginBottom: 10, fontWeight: 'bold' },
  dayBox: { width: COLUMN_WIDTH, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  daySelected: { backgroundColor: '#5EA5E8', borderRadius: 20 },
  dayText: { fontSize: 14, color: "#4b5563" },
  quickDateRow: { flexDirection: "row", flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  quickDateBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: "#f3f4f6", borderRadius: 8 },
  quickDateText: { fontSize: 13, color: "#4b5563" },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionLabel: { fontSize: 14, color: '#374151' },
  optionValue: { fontSize: 14, color: '#9ca3af' },
  modalFooter: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 15, marginTop: 20 },
  cancelText: { color: "#5EA5E8", fontWeight: "bold" },
  confirmBtn: { backgroundColor: "#5EA5E8", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  confirmBtnText: { color: "#fff", fontWeight: "bold" },
  repeatOptions: { flexDirection: "row", gap: 10, marginBottom: 30 },
  optBtn: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: "#f3f4f6", borderRadius: 8 },
  optBtnActive: { backgroundColor: "#5EA5E8" },
  optText: { color: "#4b5563" },
  optTextActive: { color: "#fff", fontWeight: "bold" },
  cancelBlueBtn: { backgroundColor: "#5EA5E8", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  outlineBtn: { borderWidth: 1, borderColor: "#5EA5E8", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
=======
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
>>>>>>> a84cdfae8e071f99e687eb8d24b4d7a6886deea6

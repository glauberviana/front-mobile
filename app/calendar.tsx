import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTasks } from "@/src/contexts/TasksContext";
import TaskCard from "@/src/components/TaskCard";
import CreateTaskModal from "@/src/components/CreateTaskModal";

const COLORS = {
  accent: "#5EA5E8",
  white: "#FFFFFF",
  background: "#F3F4F6",
  bottomBar: "#F8F8F8",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  handle: "#D1D5DB",
};

LocaleConfig.locales["pt-br"] = {
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

const MONTH_IMAGES: Record<number, ImageSourcePropType> = {
  0: require("../assets/images/janeiro.png"),
  1: require("../assets/images/fevereiro.png"),
  2: require("../assets/images/marco.png"),
  3: require("../assets/images/abril.png"),
  4: require("../assets/images/maio.png"),
  5: require("../assets/images/junho.png"),
  6: require("../assets/images/julho.png"),
  7: require("../assets/images/agosto.png"),
};

const FALLBACK_IMAGE = require("../assets/images/marco.png");

const calendarTheme: any = {
  backgroundColor: "transparent",
  calendarBackground: "transparent",
  textSectionTitleColor: "rgba(255,255,255,0.92)",
  selectedDayBackgroundColor: COLORS.accent,
  selectedDayTextColor: COLORS.white,
  todayBackgroundColor: "rgba(255,255,255,0.16)",
  todayTextColor: COLORS.white,
  dayTextColor: COLORS.white,
  textDisabledColor: "rgba(255,255,255,0.30)",
  dotColor: COLORS.white,
  selectedDotColor: COLORS.white,
  arrowColor: COLORS.white,
  monthTextColor: COLORS.white,
  textDayFontWeight: "500",
  textMonthFontWeight: "700",
  textDayHeaderFontWeight: "600",
  textDayFontSize: 15,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 12,
  "stylesheet.calendar.header": {
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 4,
      marginBottom: 8,
    },
    monthText: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.white,
      letterSpacing: 0.3,
    },
  },
  "stylesheet.calendar.main": {
    week: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
  },
};

export default function CalendarScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const { tasks, isLoading, categories, addCategory, handleSaveTask, handleDeleteTask, handleToggleComplete } = useTasks();

  const todayString = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(todayString);
  const [visibleMonth, setVisibleMonth] = useState(todayString);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const currentMonth = useMemo(() => new Date(`${visibleMonth}T12:00:00`).getMonth(), [visibleMonth]);
  const backgroundImage = useMemo(() => MONTH_IMAGES[currentMonth] ?? FALLBACK_IMAGE, [currentMonth]);

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const formattedSelectedDate = useMemo(() => {
    const date = new Date(`${selectedDate}T12:00:00`);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
       if(!task.due_date) return false;
       return task.due_date.split(' ')[0] === selectedDate;
    });
  }, [selectedDate, tasks]);

  const markedDates = useMemo(() => {
    const dates: any = {
      [selectedDate]: {
        selected: true,
        selectedColor: COLORS.accent,
        selectedTextColor: COLORS.white,
      },
    };
    
    tasks.forEach(task => {
      if (task.due_date) {
        const dateStr = task.due_date.split(' ')[0];
        if (!dates[dateStr]) {
          dates[dateStr] = { marked: true, dotColor: COLORS.white };
        } else if (dateStr !== selectedDate) {
          dates[dateStr].marked = true;
          dates[dateStr].dotColor = COLORS.white;
        } else {
          dates[dateStr].marked = true;
        }
      }
    });
    
    return dates;
  }, [tasks, selectedDate]);

  const bottomBarHeight = 60 + insets.bottom;
  const fabBottom = bottomBarHeight + 16;

  function handleDayPress(day: DateData) {
    setSelectedDate(day.dateString);
    setVisibleMonth(day.dateString);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          style={styles.header}
          imageStyle={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay} />
          <View style={{ height: Math.max(insets.top - 8, 0) }} />

          <View style={styles.calendarWrapper}>
            <Calendar
              current={visibleMonth}
              onDayPress={handleDayPress}
              onMonthChange={(month) => setVisibleMonth(month.dateString)}
              enableSwipeMonths
              hideExtraDays={false}
              markedDates={markedDates}
              theme={calendarTheme}
              style={styles.calendar}
            />
          </View>
        </ImageBackground>

        <View style={styles.contentCard}>
          <View style={styles.dragHandle} />

          <Text style={styles.selectedDateText}>
            {capitalize(formattedSelectedDate)}
          </Text>

          <View style={styles.divider} />

          {isLoading && tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
          ) : filteredTasks.length === 0 ? (
             <View style={styles.emptyState}>
               <View style={styles.emptyIconWrapper}>
                 <MaterialIcons name="event-note" size={36} color={COLORS.accent} />
               </View>
               <Text style={styles.emptyTitle}>Nenhuma tarefa</Text>
               <Text style={styles.emptySubtitle}>
                 Toque em + para adicionar uma tarefa neste dia.
               </Text>
             </View>
          ) : (
            <FlatList
              data={filteredTasks}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: bottomBarHeight + 90, paddingHorizontal: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTask({
                      ...item,
                      dateStr: item.due_date ? item.due_date.split(' ')[0] : null
                    });
                    setModalMode("edit");
                    setShowCreateModal(true);
                  }}
                >
                  <TaskCard 
                    task={item} 
                    onToggle={handleToggleComplete} 
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.fab, { bottom: fabBottom }]}
          activeOpacity={0.85}
          onPress={() => {
            setModalMode("create");
            setSelectedTask({ dateStr: selectedDate });
            setShowCreateModal(true);
          }}
        >
          <MaterialIcons
            name="add"
            size={30}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom, minHeight: bottomBarHeight }]}>
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
            onPress={() => router.push("/dashboard")}
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
            onPress={() => router.push("/dashboard")}
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
        onAddCategory={addCategory}
        onClose={() => setShowCreateModal(false)}
        onSaveTask={async (data: any) => {
           await handleSaveTask(data, modalMode, selectedTask?.id);
           setShowCreateModal(false);
        }}
        onDeleteTask={async () => {
           if(selectedTask) {
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
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    width: "100%",
    height: 320,
    justifyContent: "flex-start",
  },

  headerImage: {
    width: "100%",
    height: "100%",
  },

  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.32)",
  },

  calendarWrapper: {
    marginHorizontal: 14,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  calendar: {
    backgroundColor: "transparent",
    borderRadius: 20,
  },

  contentCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  dragHandle: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.handle,
    alignSelf: "center",
    marginBottom: 18,
  },

  selectedDateText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    textTransform: "capitalize",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 14,
    marginBottom: 10,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(94,165,232,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textMuted,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  fab: {
    position: "absolute",
    right: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  bottomBar: {
    backgroundColor: COLORS.bottomBar,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});

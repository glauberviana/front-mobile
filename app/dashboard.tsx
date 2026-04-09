import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const BAR_DATA = [6, 4, 4, 4, 6.5, 1, 3]; // barras do gráfico
const MAX_BAR = 8;

const overdueTasks = [
  "Revisar relatório mensal",
  "Reunião com equipe",
  "Entregar proposta comercial",
  "Atualizar documentação",
];

const upcomingTasks = [
  "Revisar relatório mensal",
  "Reunião com equipe",
  "Entregar proposta comercial",
  "Atualizar documentação",
];

const BAR_MAX_HEIGHT = 80;

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const insets = useSafeAreaInsets();
  const bottomBarHeight = 60 + insets.bottom;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialIcons name="person-outline" size={24} color="#5EA5E8" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Bem-vindo de volta</Text>
          <Text style={styles.userName}>Nayelly Roberta</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="edit" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
      >
        {/* Cards de estatísticas */}
        <Text style={styles.sectionLabel}>Visão geral de tarefas</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#5EA5E8" }]}>
            <Text style={[styles.statNum, { color: "#fff" }]}>0</Text>
            <Text
              style={[styles.statLabel, { color: "rgba(255,255,255,0.85)" }]}
            >
              Concluídas
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#F5C17A" }]}>
            <Text style={[styles.statNum, { color: "#633806" }]}>0</Text>
            <Text style={[styles.statLabel, { color: "#854F0B" }]}>
              Pendentes
            </Text>
          </View>
        </View>

        {/* Gráfico de barras */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Conclusão de tarefas diária</Text>
            <View style={styles.chartNav}>
              <TouchableOpacity>
                <MaterialIcons name="chevron-left" size={18} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.chartNavText}>28/3–1</Text>
              <TouchableOpacity>
                <MaterialIcons name="chevron-right" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartBody}>
            {/* Labels Y */}
            <View style={styles.yLabels}>
              {[MAX_BAR, MAX_BAR / 2, 0].map((v) => (
                <Text key={v} style={styles.yLabel}>
                  {v}
                </Text>
              ))}
            </View>

            {/* Barras */}
            <View style={styles.barsArea}>
              {BAR_DATA.map((val, i) => (
                <View key={i} style={styles.barWrap}>
                  <View
                    style={[
                      styles.bar,
                      { height: (val / MAX_BAR) * BAR_MAX_HEIGHT },
                    ]}
                  />
                  <Text style={styles.barLabel}>{DAYS[i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Tarefas atrasadas */}
        <TaskSection title="Tarefas Atrasadas" tasks={overdueTasks} />

        {/* Próximas tarefas */}
        <TaskSection
          title="Tarefas nos próximos 7 dias"
          tasks={upcomingTasks}
        />

        <Text style={styles.hint}>Configurando dia, horário, repetição</Text>
      </ScrollView>

      {/* Bottom Bar */}
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
          // onPress={() => router.push("/create")}
        >
          {pathname === "/create" ? (
            <View style={styles.activeCircle}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </View>
          ) : (
            <MaterialIcons name="add" size={24} color="#5EA5E8" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          activeOpacity={0.8}
          onPress={() => router.push("/home")}
        >
          {pathname === "/home" ? (
            <View style={styles.activeCircle}>
              <MaterialIcons name="list" size={22} color="#fff" />
            </View>
          ) : (
            <MaterialIcons name="list" size={22} color="#5EA5E8" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          activeOpacity={0.8}
          // onPress={() => router.push("/calendar")}
        >
          {pathname === "/calendar" ? (
            <View style={styles.activeCircle}>
              <MaterialIcons name="calendar-today" size={22} color="#fff" />
            </View>
          ) : (
            <MaterialIcons name="calendar-today" size={22} color="#5EA5E8" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          activeOpacity={0.8}
          onPress={() => router.push("/dashboard")}
        >
          {pathname === "/dashboard" ? (
            <View style={styles.activeCircle}>
              <MaterialIcons name="person-outline" size={24} color="#fff" />
            </View>
          ) : (
            <MaterialIcons name="person-outline" size={24} color="#5EA5E8" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TaskSection({ title, tasks }: { title: string; tasks: string[] }) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <MaterialIcons name="calendar-today" size={16} color="#5EA5E8" />
        <Text style={styles.taskTitle}>{title}</Text>
      </View>
      {tasks.map((t, i) => (
        <View key={i} style={styles.taskItem}>
          <View style={styles.dot} />
          <Text style={styles.taskText}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F1FB",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: { flex: 1, marginLeft: 10 },
  greeting: { fontSize: 11, color: "#6B7280" },
  userName: { fontSize: 14, fontWeight: "500", color: "#1F2937" },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1F2937",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statNum: { fontSize: 24, fontWeight: "500" },
  statLabel: { fontSize: 12 },

  chartCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    padding: 10,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  chartTitle: { fontSize: 11, color: "#6B7280" },
  chartNav: { flexDirection: "row", alignItems: "center", gap: 2 },
  chartNavText: { fontSize: 10, color: "#6B7280" },
  chartBody: { flexDirection: "row", alignItems: "flex-end" },
  yLabels: {
    height: 80 + 16,
    justifyContent: "space-between",
    marginRight: 4,
    paddingBottom: 16,
  },
  yLabel: { fontSize: 9, color: "#6B7280", textAlign: "right" },
  barsArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80 + 16,
    gap: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  barWrap: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 3, backgroundColor: "#5EA5E8" },
  barLabel: { fontSize: 9, color: "#6B7280", marginTop: 4 },

  taskCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    padding: 10,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  taskBadge: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: "#5EA5E8",
    alignItems: "center",
    justifyContent: "center",
  },
  taskBadgeText: { fontSize: 11, fontWeight: "500", color: "#fff" },
  taskTitle: { fontSize: 13, fontWeight: "500", color: "#1F2937" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#E24B4A" },
  taskText: { fontSize: 12, color: "#1F2937" },

  hint: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 6,
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
  bottomItem: { width: 50, alignItems: "center", justifyContent: "center" },
  activeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5EA5E8",
    alignItems: "center",
    justifyContent: "center",
  },
});

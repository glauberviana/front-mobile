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
import { BarChart } from "react-native-gifted-charts";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const barData = [
  {
    value: 6,
    label: "Dom",
    frontColor: "#5EA5E8",
  },
  {
    value: 4,
    label: "Seg",
    frontColor: "#5EA5E8",
  },
  {
    value: 4,
    label: "Ter",
    frontColor: "#5EA5E8",
  },
  {
    value: 4,
    label: "Qua",
    frontColor: "#5EA5E8",
  },
  {
    value: 6.5,
    label: "Qui",
    frontColor: "#5EA5E8",
  },
  {
    value: 1,
    label: "Sex",
    frontColor: "#5EA5E8",
  },
  {
    value: 3,
    label: "Sáb",
    frontColor: "#5EA5E8",
  },
];

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

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const bottomBarHeight = 60 + insets.bottom;

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialIcons
            name="person-outline"
            size={24}
            color="#5EA5E8"
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.greeting}>
            Bem-vindo de volta
          </Text>

          <Text style={styles.userName}>
            Nayelly Roberta
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push("/tasks/edit")
          }
        >
          <MaterialIcons
            name="edit"
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            bottomBarHeight + 16,
        }}
      >
        {/* Cards */}
        <Text style={styles.sectionLabel}>
          Visão geral de tarefas
        </Text>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: "#5EA5E8" },
            ]}
          >
            <Text
              style={[
                styles.statNum,
                { color: "#fff" },
              ]}
            >
              0
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    "rgba(255,255,255,0.85)",
                },
              ]}
            >
              Concluídas
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: "#F5C17A" },
            ]}
          >
            <Text
              style={[
                styles.statNum,
                { color: "#633806" },
              ]}
            >
              0
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: "#854F0B" },
              ]}
            >
              Pendentes
            </Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              Conclusão de tarefas diária
            </Text>

            <View style={styles.chartNav}>
              <TouchableOpacity>
                <MaterialIcons
                  name="chevron-left"
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>

              <Text style={styles.chartNavText}>
                28/ 3–1
              </Text>

              <TouchableOpacity>
                <MaterialIcons
                  name="chevron-right"
                  size={18}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <BarChart
            data={barData}
            barWidth={32}
            spacing={10}
            xAxisThickness={0.5}
            yAxisThickness={0}
            yAxisTextStyle={styles.yAxisText}
            xAxisLabelTextStyle={styles.xAxisText}
            noOfSections={4}
            maxValue={8}
            initialSpacing={8}
            endSpacing={8}
            labelWidth={36}
            hideRules={false}
          />
        </View>

        {/* Tarefas atrasadas */}
        <TaskSection
          title="Tarefas Atrasadas"
          tasks={overdueTasks}
        />

        {/* Próximas tarefas */}
        <TaskSection
          title="Tarefas nos próximos 7 dias"
          tasks={upcomingTasks}
        />

        <Text style={styles.hint}>
          Configurando dia, horário,
          repetição
        </Text>
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
          onPress={() =>
            router.push("/dashboard")
          }
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
    </SafeAreaView>
  );
}

function TaskSection({
  title,
  tasks,
}: {
  title: string;
  tasks: string[];
}) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <MaterialIcons
          name="calendar-today"
          size={16}
          color="#5EA5E8"
        />

        <Text style={styles.taskTitle}>
          {title}
        </Text>
      </View>

      {tasks.map((t, i) => (
        <View key={i} style={styles.taskItem}>
          <View style={styles.dot} />

          <Text style={styles.taskText}>
            {t}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6F1FB",
    alignItems: "center",
    justifyContent: "center",
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  greeting: {
    fontSize: 12,
    color: "#6B7280",
  },

  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 84,
  },

  statNum: {
    fontSize: 32,
    fontWeight: "700",
  },

  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  chartCard: {
    marginHorizontal: 18,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    padding: 14,
    overflow: "hidden",
  },

  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  chartTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },

  chartNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  chartNavText: {
    fontSize: 12,
    color: "#6B7280",
  },

  yAxisText: {
    color: "#6B7280",
    fontSize: 11,
  },

  xAxisText: {
    color: "#6B7280",
    fontSize: 11,
    marginTop: 4,
  },

  barTopLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 2,
  },

  taskCard: {
    marginHorizontal: 18,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    padding: 14,
  },

  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#E24B4A",
  },

  taskText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },

  hint: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 12,
  },

  bottomBar: {
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 10,
  },

  bottomItem: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  activeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#5EA5E8",
    alignItems: "center",
    justifyContent: "center",
  },
});

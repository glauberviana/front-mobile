import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  LinearGradient,
  Polygon,
  Rect,
  Stop,
} from "react-native-svg";

const { width } = Dimensions.get("window");

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

type ThemeFeature = "moon" | "stars" | "clouds" | "rain" | "sun" | "snow";

interface MonthTheme {
  sky1: string;
  sky2: string;
  ground: string;
  feat: ThemeFeature;
}

const THEMES: MonthTheme[] = [
  { sky1: "#0a0a2e", sky2: "#1a1a4e", ground: "#1a2a1a", feat: "moon" },
  { sky1: "#1a0a3e", sky2: "#2a1060", ground: "#1a1a2a", feat: "stars" },
  { sky1: "#0d2b4e", sky2: "#1a4a7a", ground: "#1a2a1a", feat: "clouds" },
  { sky1: "#1a3a1a", sky2: "#2d6a2d", ground: "#2a1a0a", feat: "rain" },
  { sky1: "#1a2a3e", sky2: "#2a4a6e", ground: "#1a2a1a", feat: "sun" },
  { sky1: "#3e1a0a", sky2: "#6e3a1a", ground: "#2a1a0a", feat: "sun" },
  { sky1: "#0a1a3e", sky2: "#1a3a6e", ground: "#1a2a2a", feat: "moon" },
  { sky1: "#3e2a0a", sky2: "#6e4a1a", ground: "#2a1a0a", feat: "clouds" },
  { sky1: "#1a0a2e", sky2: "#3a1a5e", ground: "#1a1a2a", feat: "stars" },
  { sky1: "#0a2a1a", sky2: "#1a5a3a", ground: "#1a2a1a", feat: "rain" },
  { sky1: "#0a0a3e", sky2: "#1a1a6e", ground: "#0a1a2a", feat: "moon" },
  { sky1: "#3e0a0a", sky2: "#6e1a1a", ground: "#2a0a0a", feat: "snow" },
];

function CalendarBackground({ month }: { month: number }) {
  const t = THEMES[month];
  const W = width;
  const H = 340;

  const renderFeature = () => {
    switch (t.feat) {
      case "moon":
        return (
          <>
            <Circle cx={W * 0.8} cy={50} r={22} fill="#fffde7" opacity={0.9} />
            <Circle
              cx={W * 0.8 + 12}
              cy={44}
              r={16}
              fill={t.sky2}
              opacity={0.8}
            />
          </>
        );
      case "stars":
        return (
          <>
            {[
              [30, 20],
              [80, 35],
              [150, 15],
              [200, 40],
              [260, 25],
              [50, 55],
              [120, 48],
              [220, 60],
            ].map(([x, y], i) => (
              <Circle key={i} cx={x} cy={y} r={1.5} fill="#fff" opacity={0.7} />
            ))}
          </>
        );
      case "clouds":
        return (
          <>
            <Ellipse
              cx={80}
              cy={60}
              rx={45}
              ry={20}
              fill="#fff"
              opacity={0.18}
            />
            <Ellipse
              cx={220}
              cy={45}
              rx={60}
              ry={22}
              fill="#fff"
              opacity={0.14}
            />
          </>
        );
      case "rain":
        return (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <Line
                key={i}
                x1={(i * 25) % W}
                y1={(i * 18) % 140}
                x2={((i * 25) % W) - 3}
                y2={((i * 18) % 140) + 12}
                stroke="#adf"
                strokeWidth={1.2}
                opacity={0.4}
              />
            ))}
          </>
        );
      case "sun":
        return (
          <Circle cx={W * 0.85} cy={55} r={30} fill="#ffe066" opacity={0.8} />
        );
      case "snow":
        return (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <Circle
                key={i}
                cx={(i * 22) % W}
                cy={(i * 14) % 140}
                r={2.5}
                fill="#fff"
                opacity={0.6}
              />
            ))}
          </>
        );
    }
  };

  return (
    <View style={{ height: H }}>
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={t.sky1} />
            <Stop offset="1" stopColor={t.sky2} />
          </LinearGradient>
        </Defs>
        <Rect width={W} height={H} fill="url(#sky)" />
        {renderFeature()}
        <Polygon
          points={`0,160 80,100 160,140 240,80 ${W * 0.8},130 ${W},90 ${W},${H} 0,${H}`}
          fill={t.ground}
          opacity={0.85}
        />
      </Svg>
    </View>
  );
}

export default function CalendarScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const today = new Date();
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const firstWeekday = new Date(curYear, curMonth, 1).getDay();

  const calCells = useMemo(() => {
    const cells: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [daysInMonth, firstWeekday]);

  const isToday = (d: number) =>
    d === today.getDate() &&
    curMonth === today.getMonth() &&
    curYear === today.getFullYear();

  const cellSize = (width - 40) / 7;

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <View style={styles.calHeader}>
        <CalendarBackground month={curMonth} />

        <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={() => setCurMonth((m) => (m === 0 ? 11 : m - 1))}
              style={styles.navBtn}
            >
              <MaterialIcons name="chevron-left" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTHS[curMonth]} {curYear}
            </Text>
            <TouchableOpacity
              onPress={() => setCurMonth((m) => (m === 11 ? 0 : m + 1))}
              style={styles.navBtn}
            >
              <MaterialIcons name="chevron-right" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEK_DAYS.map((d, i) => (
              <Text key={i} style={[styles.weekDay, { width: cellSize }]}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calCells.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayCell,
                  { width: cellSize, height: cellSize },
                  day && isToday(day) ? styles.todayCell : undefined,
                  day && selectedDay === day && !isToday(day)
                    ? styles.selectedCell
                    : undefined,
                ]}
                onPress={() => day && setSelectedDay(day)}
                disabled={!day}
              >
                {day ? (
                  <Text
                    style={[
                      styles.dayText,
                      isToday(day)
                        ? { color: THEMES[curMonth].sky1, fontWeight: "bold" }
                        : {},
                      selectedDay === day && !isToday(day)
                        ? { fontWeight: "bold" }
                        : {},
                    ]}
                  >
                    {day}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.dragHandle} />
        <Text style={styles.selLabel}>
          {selectedDay} de {MONTHS[curMonth]}
        </Text>

        <View style={styles.emptyState}>
          <MaterialIcons name="event-note" size={50} color="#E5E7EB" />
          <Text style={styles.emptyText}>Sem tarefas agendadas</Text>
        </View>
      </View>

      {/* Navegação Inferior */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => router.push("/home" as any)}
        >
          <MaterialIcons
            name="list"
            size={26}
            color={pathname === "/home" ? "#5EA5E8" : "#9CA3AF"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <View style={styles.activeIndicator}>
            <MaterialIcons name="calendar-today" size={24} color="#5EA5E8" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <MaterialIcons name="person-outline" size={26} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 80 }]}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  calHeader: { position: "relative" },
  headerOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  navBtn: { padding: 5 },
  monthTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowRadius: 3,
  },
  weekRow: { flexDirection: "row", paddingHorizontal: 20, marginTop: 10 },
  weekDay: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  dayCell: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  dayText: { fontSize: 15, color: "#fff" },
  todayCell: { backgroundColor: "#fff" },
  selectedCell: { borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)" },

  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -30,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  selLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 20,
  },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#9CA3AF", marginTop: 10, fontSize: 15 },

  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5EA5E8",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  bottomBar: {
    flexDirection: "row",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "center",
  },
  bottomItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  activeIndicator: {
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#5EA5E8",
  },
});

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type TaskData = {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  repeat?: string;
  is_completed?: boolean;
};

type TaskCardProps = {
  task: TaskData;
  onToggle?: (id: string, is_completed: boolean) => void;
  isSelected?: boolean;
};

export default function TaskCard({ task, onToggle, isSelected }: TaskCardProps) {
  // Helpers to format date: "2026-03-04 12:00:00" -> "04 mar 2026"
  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      if (isNaN(date.getTime())) return "";
      
      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (e) {
      return "";
    }
  };

  const formattedDate = getFormattedDate(task.due_date);

  const getRepeatColor = (repeat?: string) => {
    switch (repeat?.toLowerCase()) {
      case "semanal": return { bg: "#90CBA1", text: "#4B5563" }; // Verde suave
      case "mensal": return { bg: "#F1CA9A", text: "#4B5563" };  // Laranja suave
      case "diário": return { bg: "#9BB1D9", text: "#4B5563" };  // Azul/Roxo suave
      default: return { bg: "#e5e7eb", text: "#4B5563" };
    }
  };

  const repeatStyle = getRepeatColor(task.repeat);

  return (
    <View style={[styles.card, isSelected && styles.cardSelected]}>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        activeOpacity={0.7}
        onPress={() => onToggle && onToggle(task.id, !!task.is_completed)}
      >
        {task.is_completed ? (
          <MaterialIcons name="check-circle" size={26} color="#4585DE" />
        ) : (
          <MaterialIcons name="radio-button-unchecked" size={26} color="#4585DE" />
        )}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={[styles.title, task.is_completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        {task.repeat && task.repeat !== "Não repete" ? (
          <View style={[styles.badge, { backgroundColor: repeatStyle.bg }]}>
            <Text style={[styles.badgeText, { color: repeatStyle.text }]}>
              {task.repeat}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.40,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#1E88E5",
  },
  checkboxContainer: {
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  description: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "400",
  },
  rightContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 10,
    minWidth: 75,
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
});

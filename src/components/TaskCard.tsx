import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Task = {
  title: string;
};

export default function TaskCard({ title }: Task) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
});

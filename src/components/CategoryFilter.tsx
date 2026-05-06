import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CategoryFilterProps = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  onPressCreate?: () => void;
};

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  onPressCreate,
}: CategoryFilterProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((item) => {
          const isActive = selected === item;

          return (
            <TouchableOpacity
              key={item}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => onSelect(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },

  button: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  activeButton: {
    backgroundColor: "#5EA5E8",
  },

  text: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
});

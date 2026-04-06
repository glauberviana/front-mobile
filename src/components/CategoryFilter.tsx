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
};

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
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
    paddingTop: 60,
    paddingBottom: 8,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "flex-start",

    gap: 10,
  },

  button: {
    backgroundColor: "#BFD2F6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },

  activeButton: {
    backgroundColor: "#5EA5E8",
  },

  text: {
    fontSize: 12,
    color: "#6B7280",
  },

  activeText: {
    color: "#fff",
  },
});

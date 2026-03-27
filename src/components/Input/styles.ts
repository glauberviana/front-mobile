import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    width: "100%",
  },

  icon: {
    marginRight: 8,
  },

  iconRight: {
    marginLeft: 8,
  },

  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    color: "#000000",

    ...Platform.select({
      web: {
        outlineStyle: "none",
      } as any,
    }),
  },

  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
});
